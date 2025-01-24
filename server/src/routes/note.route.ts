import { Hono } from "hono";
import protectRoute from "../middlewares/protectRoute.middleware.js";
import { zValidator } from "@hono/zod-validator";
import { noteCreateSchema } from "../validations/note.validation.js";
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
  return c.json({
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
  });
});

noteRoute.get("/:noteId", protectRoute, async (c) => {
  const { userId } = c.var;
  const { noteId } = c.req.param();
  const note = await db.note.findFirst({
    where: {
      AND: [{ id: noteId }, { userId }],
    },
    include: {
      tags: true,
    },
  });
  return c.json({ data: { note }, error: null, success: true });
});

export default noteRoute;
