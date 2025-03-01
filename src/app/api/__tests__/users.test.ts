import { POST, GET } from "../users/route";
import { NextRequest } from "next/server";

const mockCollection = {
  findOne: jest.fn(),
  insertOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

jest.mock("@/utils/mongodb", () => {
  const mockDb = {
    collection: jest.fn(() => mockCollection),
  };

  const mockClient = {
    db: jest.fn(() => mockDb),
  };

  return {
    __esModule: true,
    default: Promise.resolve(mockClient),
  };
});

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (mockCollection.findOne as jest.Mock).mockImplementation((query) => {
      if (query.username === "getuser") {
        return Promise.resolve({
          username: "getuser",
          score: { correct: 0, incorrect: 0 },
        });
      }
      return Promise.resolve(null);
    });

    (mockCollection.insertOne as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ acknowledged: true, insertedId: "123" });
    });
  });

  describe("POST /api/users", () => {
    it("creates a new user", async () => {

      (mockCollection.findOne as jest.Mock).mockResolvedValueOnce(null);

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
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        username: "testuser",
      });
      expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it("returns existing user if username exists", async () => {

      (mockCollection.findOne as jest.Mock).mockResolvedValueOnce({
        username: "testuser",
        score: { correct: 5, incorrect: 2 },
      });

      const req = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify({ username: "testuser" }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        username: "testuser",
        score: { correct: 5, incorrect: 2 },
      });
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        username: "testuser",
      });
      expect(mockCollection.insertOne).not.toHaveBeenCalled();
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
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        username: "getuser",
      });
    });

    it("returns 404 if user is not found", async () => {

      (mockCollection.findOne as jest.Mock).mockResolvedValueOnce(null);

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
