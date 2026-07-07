// src/seed.ts
import { faker } from "@faker-js/faker";

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
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    });
  }

  return contacts;
};

const runSeeder = async () => {
  try {
    console.log("Generating dummy data...");
    const contacts = generateContacts(30);

    // TODO: Clear existing contacts (await Contact.deleteMany({}))

    // TODO: Insert new contacts (await Contact.insertMany(contacts))

    console.table(contacts.slice(0, 5));
    console.log(
      `\nSuccessfully prepared ${contacts.length} contacts for insertion.`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeeder();
