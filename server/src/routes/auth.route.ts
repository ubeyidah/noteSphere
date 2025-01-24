import { Hono } from "hono";
import { me, signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRoutes = new Hono();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/sign-in", signIn);
authRoutes.post("/sign-out", signOut);
authRoutes.get("/me", me);

export default authRoutes;
