import { serve } from "@hono/node-server";
import { configDotenv } from "dotenv";
import { Hono } from "hono";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";

// init
const app = new Hono().basePath("/api");
configDotenv();

// routes
app.route("/auth", authRoutes);

// running
const port = env("PORT") || 8000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port: port as number,
});
