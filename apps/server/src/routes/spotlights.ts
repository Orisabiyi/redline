import { Hono } from "hono";
import { prisma } from "../lib/db.js";

const app = new Hono();

app.get("/", async (c) => {
  return c.json([]);
});

app.get("/:id", async (c) => {
  return c.json({ error: "Not found" }, 404);
});

export { app as spotlightRoutes };