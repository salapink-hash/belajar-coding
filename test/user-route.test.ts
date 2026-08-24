import { describe, expect, it, mock } from "bun:test";
import { Elysia } from "elysia";

// Mock the services before importing the route
const mockLoginUser = mock(async (input: { email: string; password: string; name?: string }) => {
  if (input.email === "salapink@localhost" && input.password === "rahasia") {
    return "00000000-0000-0000-0000-000000000000";
  }
  throw new Error("email atau password salah");
});

mock.module("../src/services/user-services", () => ({
  loginUser: mockLoginUser,
  registerUser: mock(async () => ({ success: true })),
}));

// Import the routes after mocking
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
    const data = await response.json();
    expect(data).toEqual({
      data: "00000000-0000-0000-0000-000000000000",
    });
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
    const data = await response.json();
    expect(data).toEqual({
      data: "00000000-0000-0000-0000-000000000000",
    });
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
    const data = await response.json();
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
    const data = await response.json();
    expect(data).toEqual({
      data: "00000000-0000-0000-0000-000000000000",
    });
  });
});
