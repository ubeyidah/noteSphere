import { Hono } from "hono";
import protectRoute from "../middlewares/protectRoute.middleware.js";
import { zValidator } from "@hono/zod-validator";
import {
  noteCreateSchema,
  noteIdSchema,
} from "../validations/note.validation.js";
import { customValidator } from "../lib/validator.js";
import db from "../config/db.js";
import { titleToSlug } from "../lib/utils.js";

const noteRoute = new Hono();

noteRoute.post(
  "/",
  protectRoute,
  zValidator("json", noteCreateSchema, (result, c) =>
    customValidator(result, c)
  ),
  async (c) => {
    const { title, body } = c.req.valid("json");
    const userId = c.var.userId;
    const slug = titleToSlug(title);
    await db.note.create({
      data: {
        title,
        body,
        userId,
        slug,
      },
    });

    return c.json(
      {
        error: null,
        data: { message: "note created successfully" },
        success: true,
      },
      201
    );
  }
);

noteRoute.get("/", protectRoute, async (c) => {
  const { userId } = c.var;
  const page: number = parseInt(c.req.query().page) || 1;
  const limit: number = parseInt(c.req.query().limit) || 10;
  const archived = c.req.query().archived;
  const q = archived === undefined ? {} : { archived: Boolean(archived) };

  const selection = {
    where: {
      userId,
      ...q,
    },
    take: limit,
    skip: page - 1,
    omit: {
      body: true,
    },
    include: {
      tags: {
        select: {
          name: true,
        },
      },
    },
  };

  const [notes, totalNotes] = await Promise.all([
    db.note.findMany(selection),
    db.note.count({ where: { userId, ...q } }),
  ]);
  const totalPages = Math.ceil(totalNotes / limit);
  const currentPage = notes.length <= 0 ? 0 : page;
  return c.json(
    {
      data: {
        notes,
        pagination: {
          currentPage,
          totalPages,
          totalNotes,
        },
      },
      error: null,
      success: true,
    },
    200
  );
});

noteRoute.get(
  "/:noteId",
  protectRoute,
  zValidator("param", noteIdSchema, (result, c) => customValidator(result, c)),
  async (c) => {
    const { userId } = c.var;
    const { noteId } = c.req.valid("param");
    const note = await db.note.findFirst({
      where: {
        AND: [{ id: noteId }, { userId }],
      },
      include: {
        tags: true,
      },
    });
    return c.json({ data: { note }, error: null, success: true }, 200);
  }
);

noteRoute.delete(
  "/:noteId",
  protectRoute,
  zValidator("param", noteIdSchema, (result, c) => customValidator(result, c)),
  async (c) => {
    const { userId } = c.var;
    const { noteId } = c.req.valid("param");
    await db.note.delete({
      where: {
        userId,
        id: noteId,
      },
    });
    return c.json(
      {
        data: { message: "note deleted successfully" },
        error: null,
        success: true,
      },
      200
    );
  }
);

noteRoute.patch(
  "/notes/:noteId/archive",
  protectRoute,
  zValidator("param", noteIdSchema, (result, c) => customValidator(result, c)),
  async (c) => {
    const { userId } = c.var;
    const { noteId } = c.req.valid("param");
    const targetedNote = await db.note.findFirst({
      where: { id: noteId, userId },
      select: { archived: true },
    });
    if (!targetedNote) {
      return c.json(
        {
          error: { message: "Note not found" },
          sccess: false,
          data: null,
        },
        404
      );
    }
    const note = await db.note.update({
      where: { id: noteId, userId },
      data: { archived: !targetedNote.archived },
    });
    return c.json(
      {
        error: null,
        sccess: false,
        data: { note },
      },
      404
    );
  }
);

export default noteRoute;
