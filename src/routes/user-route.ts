import { Elysia, t } from "elysia";
import { loginUser, registerUser } from "../services/user-services";

const userHandler = new Elysia()
  .post(
    "/",
    async ({ body, set }) => {
      try {
        await registerUser(body);
        return {
          data: "OK",
        };
      } catch (error: any) {
        set.status = 400;
        return {
          error: error.message || "Terjadi kesalahan",
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const token = await loginUser(body);
        return {
          data: token,
        };
      } catch (error: any) {
        set.status = 400;
        return {
          error: error.message || "email atau password salah",
        };
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.String(),
        password: t.String(),
      }),
    }
  );

export const userRoutes = new Elysia()
  .group("/api/user", (app) => app.use(userHandler))
  .group("/api/users", (app) => app.use(userHandler));

