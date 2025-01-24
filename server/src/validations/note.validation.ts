import { z } from "zod";

const schema = z.object({
  noteId: z.string(),
  title: z.string().min(3, "title should be more than 3 characters"),
  body: z.string().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string()),
});

export const noteCreateSchema = schema.pick({
  title: true,
  body: true,
});

export const noteIdSchema = schema.pick({
  noteId: true,
});
