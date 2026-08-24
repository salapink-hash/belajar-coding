import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .get("/", () => ({
    message: "Hello Elysia + Bun + Drizzle + MySQL!",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
  }))
  .group("/users", (app) =>
    app
      .get("/", async () => {
        try {
          const allUsers = await db.select().from(users);
          return { success: true, data: allUsers };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      })
      .post(
        "/",
        async ({ body, set }) => {
          try {
            const result = await db.insert(users).values(body);
            set.status = 201;
            return { success: true, data: result };
          } catch (error: any) {
            set.status = 400;
            return { success: false, error: error.message };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
          }),
        }
      )
  )
  .listen(process.env.PORT ? Number(process.env.PORT) : 3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
