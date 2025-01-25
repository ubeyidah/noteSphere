import { z } from "zod";

const schema = z.object({
  noteId: z.string().cuid("Invalid note ID"),
  title: z.string().min(3, "title should be more than 3 characters"),
  body: z.string().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});

export const noteCreateSchema = schema.pick({
  title: true,
  body: true,
});

export const noteIdSchema = schema.pick({
  noteId: true,
});

export const noteUpdateSchema = schema
  .pick({
    title: true,
    body: true,
    archived: true,
    tags: true,
  })
  .partial();
