import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signUpSchema } from "../validations/auth.validation.js";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { genTokenAndSetCookie } from "../lib/auth.lib.js";
import { customValidator } from "../lib/validator.js";

const authRoutes = new Hono();

authRoutes.post(
  "/sign-up",
  zValidator("json", signUpSchema, (result, c) => customValidator(result, c)),
  async (c) => {
    const { name, email, password } = c.req.valid("json");
    const isUserExists = await db.user.findUnique({ where: { email } });
    if (isUserExists) {
      return c.json({
        success: false,
        error: { message: "Email address already token by others" },
        data: null,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hasedPassword,
      },
    });
    genTokenAndSetCookie(c, user.id);
    //   split the password from the user object
    const { password: _, ...userToSend } = user;
    return c.json(
      { data: { user: userToSend }, error: null, success: true },
      201
    );
  }
);
authRoutes.post("/sign-in");
authRoutes.post("/sign-out");
authRoutes.get("/me");

export default authRoutes;
