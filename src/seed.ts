// src/seed.ts
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Contact from "./models/Contact";

dotenv.config();

const MOCK_USER_ID = "user_12345";

const generateContacts = (count: number) => {
  const contacts = [];

  for (let i = 0; i < count; i++) {
    const isFavorite =
      faker.helpers.maybe(() => true, { probability: 0.3 }) ?? false;

    const personalNote =
      faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ??
      null;

    contacts.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      is_favorite: isFavorite,
      personal_note: personalNote,
      user_id: MOCK_USER_ID,
    });
  }

  return contacts;
};

const runSeeder = async () => {
  try {
    const dbUri = process.env.DATABASE_URI;
    if (!dbUri) {
      throw new Error("DATABASE_URI is missing from .env file");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUri);

    console.log("Clearing existing contacts...");
    await Contact.deleteMany({});

    console.log("Generating dummy data...");
    const contacts = generateContacts(30);

    console.log("Inserting contacts into the database...");
    const insertedContacts = await Contact.insertMany(contacts);

    console.table(
      insertedContacts.slice(0, 5).map((c) => ({
        Name: `${c.first_name} ${c.last_name}`,
        Favorite: c.is_favorite,
        Note: c.personal_note ? "Yes" : "No",
      })),
    );

    console.log(`\Successfully seeded ${insertedContacts.length} contacts.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeeder();
