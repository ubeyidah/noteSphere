import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "name should be more than 3 characters"),
  email: z.string().email(),
  password: z.string().min(6, "password should be more than 6 characters"),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
