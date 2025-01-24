import { serve } from "@hono/node-server";
import { configDotenv } from "dotenv";
import { Hono } from "hono";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import noteRoute from "./routes/note.route.js";

// init
const app = new Hono().basePath("/api");
configDotenv();

// routes
app.route("/auth", authRoutes);
app.route("/notes", noteRoute);

// error handler
app.onError((error, c) => {
  const message = "Internal server error";
  const statusCode = 500;

  // dev log
  console.error(error.message, error.cause);

  return c.json({ data: null, success: false, error: { message } }, statusCode);
});

// running
const port = env("PORT") || 8000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port: port as number,
});
