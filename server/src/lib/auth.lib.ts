import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import type { Context, Next } from "hono";
import { env } from "./env.js";
import db from "../config/db.js";

export const genTokenAndSetCookie = (c: Context, id: string) => {
  const token = jwt.sign({ id }, env("JWT_SECRET"), { expiresIn: "20d" });
  const expiryDate = new Date();
  const sInADay = 24 * 60 * 60;
  setCookie(c, "noteSphereSession", token, {
    expires: new Date(expiryDate.setDate(expiryDate.getDate() + 20)),
    maxAge: 20 * sInADay,
    sameSite: "Strict",
    httpOnly: true,
    secure: env("STATUS") !== "dev",
  });
};

export const verifyNoteOwnership = async (userId: string, noteId: string) => {
  const note = await db.note.findFirst({
    where: {
      id: noteId,
    },
    select: {
      userId: true,
    },
  });
  if (!note) {
    return { message: "Note not found", statusCode: 404 };
  }
  if (userId !== userId) {
    return { message: "unauthorized to make changes", statusCode: 401 };
  }
  return false;
};
