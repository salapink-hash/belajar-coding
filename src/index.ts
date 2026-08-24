import { Elysia } from "elysia";
import { userRoutes } from "./routes/user-route";

const app = new Elysia()
  .get("/", () => ({
    message: "Hello Elysia + Bun + Drizzle + MySQL!",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
  }))
  .use(userRoutes)
  .listen(process.env.PORT ? Number(process.env.PORT) : 3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
