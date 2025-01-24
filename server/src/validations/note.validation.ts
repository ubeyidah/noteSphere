import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "title should be more than 3 characters"),
  body: z.string().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string()),
});

export const noteCreateSchema = schema.pick({
  title: true,
  body: true,
});
