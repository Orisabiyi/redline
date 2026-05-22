import { Hono } from "hono";
import type { Bindings, Variables } from "..";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", async (context) => {
  return context.json([]);
});

app.get("/:id", async (context) => {
  return context.json({ error: "Not found" }, 404);
});

export { app as spotlightRoutes };