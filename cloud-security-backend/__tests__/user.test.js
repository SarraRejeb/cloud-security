const request = require("supertest");
const app = require("../server");

describe("User API", () => {
  it("should return 404 on unknown route", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });
});
