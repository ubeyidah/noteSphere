import { Hono } from "hono";
import protectRoute from "../middlewares/protectRoute.middleware.js";

const noteRoute = new Hono();

noteRoute.post("/", protectRoute, async (c) => {
  const userId = c.var.userId;
});

export default noteRoute;
