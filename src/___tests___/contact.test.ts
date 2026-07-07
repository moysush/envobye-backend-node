import request from "supertest";
import app from "../app";
import { describe, it, expect } from "@jest/globals";

describe("Contact API Feature Tests", () => {
  const testContactId = "123";

  // Test 1: Mark a contact as favorite
  it("should mark a contact as favorite", async () => {
    const response = await request(app)
      .post(`/api/contacts/${testContactId}/favorite`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("marked as favorite");
  });

  // Test 2: Update a personal note
  it("should update a personal note for a contact", async () => {
    const notePayload = { personal_note: "Met at the global hackathon" };

    const response = await request(app)
      .put(`/api/contacts/${testContactId}/note`)
      .send(notePayload);

    expect(response.status).toBe(200);
    expect(response.body.note).toBe(notePayload.personal_note);
  });

  // Test 3: Filter contacts using favorite=1
  it("should filter contacts returning only favorites", async () => {
    const response = await request(app).get("/api/contacts?favorite=1").send();

    expect(response.status).toBe(200);
    expect(response.body.filters.favorite).toBe("1");
  });
});
