import { Hono } from "hono";
import { eq, ilike, or, sql, count } from "drizzle-orm";
import { getDb } from "../lib/db.js";
import { cars, images, variants } from "../db/schema.js";
import type { Bindings, Variables } from "../index.js";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { category, page = "1", limit = "20" } = c.req.query();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = category ? eq(cars.category, category as any) : undefined;

    const [carList, totalResult] = await Promise.all([
      db.select().from(cars).where(where).orderBy(cars.name).limit(parseInt(limit)).offset(offset),
      db.select({ count: count() }).from(cars).where(where),
    ]);

    return c.json({
      cars: carList,
      total: totalResult[0].count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Failed to fetch cars" }, 500);
  }
});

app.get("/featured", async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const featured = await db.select().from(cars).orderBy(sql`random()`).limit(9);
    return c.json(featured);
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Failed to fetch featured" }, 500);
  }
});

app.get("/search", async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const q = c.req.query("q");
    if (!q) return c.json([]);

    const searchTerm = `%${q}%`;
    const results = await db
      .select()
      .from(cars)
      .where(
        or(
          ilike(cars.name, searchTerm),
          ilike(cars.make, searchTerm),
          ilike(cars.model, searchTerm)
        )
      )
      .limit(20);

    return c.json(results);
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Search failed" }, 500);
  }
});

app.get("/:slug", async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const slug = c.req.param("slug");

    const carResult = await db.select().from(cars).where(eq(cars.slug, slug));
    if (carResult.length === 0) return c.json({ error: "Car not found" }, 404);

    const car = carResult[0];
    const [carImages, carVariants] = await Promise.all([
      db.select().from(images).where(eq(images.carId, car.id)),
      db.select().from(variants).where(eq(variants.carId, car.id)),
    ]);

    return c.json({ ...car, images: carImages, variants: carVariants });
  } catch (err) {
    console.error("Error:", err);
    return c.json({ error: "Failed to fetch car" }, 500);
  }
});

export { app as carRoutes };