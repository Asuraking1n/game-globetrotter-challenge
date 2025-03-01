import { POST, GET } from "../users/route";
import { NextRequest } from "next/server";

describe("Users API", () => {
  beforeEach(() => {
    // Clear any mocked implementations
    jest.clearAllMocks();
  });

  describe("POST /api/users", () => {
    it("creates a new user", async () => {
      const req = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify({ username: "testuser" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        username: "testuser",
        score: { correct: 0, incorrect: 0 },
      });
    });

    it("returns 400 if username is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });
  });

  describe("GET /api/users/:username", () => {
    it("retrieves a user by username", async () => {

      const createReq = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify({ username: "getuser" }),
      });
      await POST(createReq);

      const req = new NextRequest(
        "http://localhost:3000/api/users?username=getuser"
      );

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        username: "getuser",
        score: { correct: 0, incorrect: 0 },
      });
    });

    it("returns 404 if user is not found", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/users?username=nonexistentuser"
      );

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
    });

    it("returns 400 if username parameter is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/users");

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
    });
  });
});
