import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import Contact from "../models/Contact";

let mongoServer: MongoMemoryServer;

const MOCK_USER_ID = "user_12345";

// spin up the in-memory database before any tests run
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// close connections after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// clear the database before every single test
beforeEach(async () => {
  await Contact.deleteMany({});
});

describe("Contact API Feature Tests", () => {
  // Test 1: Mark a contact as favorite
  it("should mark a contact as favorite", async () => {
    const contact = await Contact.create({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      is_favorite: false,
      user_id: MOCK_USER_ID,
    });

    const response = await request(app)
      .patch(`/api/contacts/${contact._id}/favorite`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.data.is_favorite).toBe(true);

    const dbContact = await Contact.findById(contact._id);
    expect(dbContact?.is_favorite).toBe(true);
  });

  // Test 2: Update a personal note
  it("should update a personal note for a contact", async () => {
    const contact = await Contact.create({
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      user_id: MOCK_USER_ID,
    });

    const notePayload = { personal_note: "Met at the global hackathon" };

    const response = await request(app)
      .put(`/api/contacts/${contact._id}/note`)
      .send(notePayload);

    expect(response.status).toBe(200);
    expect(response.body.data.personal_note).toBe(notePayload.personal_note);
  });

  // Test 3: Filter contacts returning only favorites
  it("should filter contacts returning only favorites", async () => {
    await Contact.insertMany([
      {
        first_name: "Alice",
        last_name: "Favorite",
        email: "alice@example.com",
        is_favorite: true,
        user_id: MOCK_USER_ID,
      },
      {
        first_name: "Bob",
        last_name: "Standard",
        email: "bob@example.com",
        is_favorite: false,
        user_id: MOCK_USER_ID,
      },
    ]);

    const response = await request(app).get("/api/contacts?favorite=1").send();

    // should only return Alice
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].first_name).toBe("Alice");
    expect(response.body.data[0].is_favorite).toBe(true);
  });
});
