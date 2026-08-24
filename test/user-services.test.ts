import { describe, expect, it, mock } from "bun:test";
import bcrypt from "bcryptjs";

const mockInsert = mock(() => ({
  values: mock(() => Promise.resolve({ insertId: 1 })),
}));

const mockDbUsers: any[] = [];

const mockDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve(mockDbUsers),
      }),
      innerJoin: () => ({
        where: () => ({
          limit: () => Promise.resolve(mockDbUsers),
        }),
      }),
    }),
  }),
  insert: () => mockInsert(),
};

mock.module("../src/db", () => ({
  db: mockDb,
}));

const { loginUser, getCurrentUser } = await import("../src/services/user-services");

describe("user-services: loginUser", () => {
  it("should throw error if user not found", async () => {
    mockDbUsers.length = 0;
    expect(
      loginUser({
        email: "notfound@localhost",
        password: "password",
      })
    ).rejects.toThrow("email atau password salah");
  });

  it("should throw error if password does not match", async () => {
    const hashedPassword = await bcrypt.hash("correct-password", 10);
    mockDbUsers.length = 0;
    mockDbUsers.push({
      id: 1,
      name: "Salapink",
      email: "salapink@localhost",
      password: hashedPassword,
    });

    expect(
      loginUser({
        email: "salapink@localhost",
        password: "wrong-password",
      })
    ).rejects.toThrow("email atau password salah");
  });

  it("should return a valid UUID token on successful login", async () => {
    const hashedPassword = await bcrypt.hash("rahasia", 10);
    mockDbUsers.length = 0;
    mockDbUsers.push({
      id: 1,
      name: "Salapink",
      email: "salapink@localhost",
      password: hashedPassword,
    });

    const token = await loginUser({
      name: "Salapink",
      email: "salapink@localhost",
      password: "rahasia",
    });

    expect(typeof token).toBe("string");
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });
});

describe("user-services: getCurrentUser", () => {
  it("should throw Unauthorized if token not found", async () => {
    mockDbUsers.length = 0;
    expect(getCurrentUser("invalid-token")).rejects.toThrow("Unauthorized");
  });

  it("should return user profile if token is valid", async () => {
    const createdAt = new Date("2024-01-01T00:00:00.000Z");
    mockDbUsers.length = 0;
    mockDbUsers.push({
      id: 1,
      name: "Salapink",
      email: "salapink@localhost",
      createdAt,
    });

    const user = await getCurrentUser("valid-token");
    expect(user).toEqual({
      id: 1,
      name: "Salapink",
      email: "salapink@localhost",
      created_at: createdAt,
    });
  });
});

