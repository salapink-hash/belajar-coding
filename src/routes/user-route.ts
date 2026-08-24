import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-services";

export const userRoutes = new Elysia({ prefix: "/api/users" })
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
  );
