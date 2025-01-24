import type { Context } from "hono";

export const customValidator = (result: any, c: Context) => {
  if (!result.success) {
    return c.json({ error: { message: result.error.errors[0].message } });
  }
};
