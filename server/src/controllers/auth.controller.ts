import type { Context } from "hono";

export const signUp = async (c: Context) => {};
export const signIn = async (c: Context) => {};
export const signOut = async (c: Context) => {};
export const me = async (c: Context) => {
  return c.json({ data: { name: "soe", email: "email" } }, 200);
};
