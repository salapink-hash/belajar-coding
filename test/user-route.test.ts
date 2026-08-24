import { describe, expect, it, mock } from "bun:test";
import bcrypt from "bcryptjs";
import { Elysia } from "elysia";

const hashedPassword = await bcrypt.hash("rahasia", 10);
const testCreatedAt = new Date("2024-01-01T00:00:00.000Z");

const mockUsers = [
  {
    id: 1,
    name: "Salapink",
    email: "salapink@localhost",
    password: hashedPassword,
    createdAt: testCreatedAt,
  },
];

const mockSessions = [
  {
    id: 1,
    token: "valid-token-uuid",
    userId: 1,
    createdAt: testCreatedAt,
  },
];

const mockDb = {
  select: (fields?: any) => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: () => {
          // Check if condition or query is for users by email
          return Promise.resolve(mockUsers);
        },
      }),
      innerJoin: () => ({
        where: (condition: any) => ({
          limit: () => {
            return Promise.resolve(mockUsers);
          },
        }),
      }),
    }),
  }),
  insert: () => ({
    values: () => Promise.resolve({ insertId: 1 }),
  }),
};

mock.module("../src/db", () => ({
  db: mockDb,
}));

const { userRoutes } = await import("../src/routes/user-route");
const app = new Elysia().use(userRoutes);

describe("POST /api/user/login and /api/users/login", () => {
  it("should successfully login with valid credentials (POST /api/user/login)", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Salapink",
          email: "salapink@localhost",
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = (await response.json()) as any;
    expect(typeof data.data).toBe("string");
  });

  it("should successfully login without name field (POST /api/user/login)", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "salapink@localhost",
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = (await response.json()) as any;
    expect(typeof data.data).toBe("string");
  });

  it("should return 400 with error message on wrong password", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Salapink",
          email: "salapink@localhost",
          password: "wrong-password",
        }),
      })
    );

    expect(response.status).toBe(400);
    const data = (await response.json()) as any;
    expect(data).toEqual({
      error: "email atau password salah",
    });
  });

  it("should also work via /api/users/login", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "salapink@localhost",
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = (await response.json()) as any;
    expect(typeof data.data).toBe("string");
  });
});

describe("GET /api/user/current", () => {
  it("should return current user data when valid token is provided", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/user/current", {
        method: "GET",
        headers: {
          Authorization: "Bearer valid-token-uuid",
        },
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as any;
    expect(body).toEqual({
      data: {
        id: 1,
        name: "Salapink",
        email: "salapink@localhost",
        created_at: testCreatedAt.toISOString(),
      },
    });
  });

  it("should return 401 Unauthorized when Authorization header is missing", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/user/current", {
        method: "GET",
      })
    );

    expect(response.status).toBe(401);
    const body = (await response.json()) as any;
    expect(body).toEqual({
      error: "Unauthorized",
    });
  });
});

