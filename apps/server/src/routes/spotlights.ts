import { Hono } from "hono";
import { prisma } from "../lib/db";

const app = new Hono();

app.get("/", async (context) => {
  return context.json([]);
});

app.get("/:id", async (context) => {
  return context.json({ error: "Not found" }, 404);
});

export { app as spotlightRoutes };