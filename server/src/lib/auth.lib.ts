import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import type { Context } from "hono";
import { env } from "./env.js";

export const genTokenAndSetCookie = (c: Context, id: string) => {
  const token = jwt.sign({ id }, env("JWT_SECRET"), { expiresIn: "20d" });
  const expiryDate = new Date();
  setCookie(c, "noteSphereSession", token, {
    expires: new Date(expiryDate.setDate(expiryDate.getDate() + 20)),
    maxAge: 20 * 24 * 60 * 60 * 1000,
    sameSite: "Strict",
    httpOnly: true,
    path: "/",
    secure: env("STATUS") !== "dev",
  });
};
