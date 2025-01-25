import { z } from "zod";

const sortEnum = z.enum(["desc", "asc"]);

const schema = z.object({
  noteId: z.string().cuid("Invalid note ID"),
  title: z.string().min(3, "title should be more than 3 characters"),
  body: z.string().optional(),
  archived: z.boolean().optional(),
  query: z.string(),
  color: z.string(),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
  tagName: z.string().min(1, "Tag cannot be empty"),
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
  slug: z.string(),
  sort: z.object({
    sortBy: z.string(),
    sortOrder: sortEnum,
  }),
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

export const searchNoteSchema = schema
  .pick({
    query: true,
    archived: true,
    color: true,
    tagName: true,
    limit: true,
    page: true,
    slug: true,
    sort: true,
  })
  .partial();

export const noteGetSchema = z.object({
  sortBy: z.string(),
  sortOrder: sortEnum,
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
});
