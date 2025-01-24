import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { env } from "../lib/env.js";

const protectRoute = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  const token = getCookie(c, "noteSphereSession");
  if (!token) {
    return c.json(
      {
        data: null,
        success: false,
        error: { message: "Unauthorized" },
      },
      401
    );
  }
  const decoded = jwt.verify(token, env("JWT_SECRET"));
  if (!decoded || typeof decoded === "string") {
    return c.json(
      {
        data: null,
        success: false,
        error: { message: "Unauthorized" },
      },
      401
    );
  }
  const id = (decoded as jwt.JwtPayload).id;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) {
    return c.json(
      {
        data: null,
        success: false,
        error: { message: "user not found" },
      },
      404
    );
  }
  c.set("userId", user.id);
  await next();
});

export default protectRoute;
