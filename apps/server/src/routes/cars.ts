// src/routes/cars.ts
import { Hono } from "hono";
import { prisma } from "../lib/db.js";

const app = new Hono();

// List cars
app.get("/", async (c) => {
  try {
    const { category, page = "1", limit = "20" } = c.req.query();

    const where = category ? { category } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { images: { where: { isPrimary: true }, take: 1 } },
        skip,
        take: parseInt(limit),
        orderBy: { name: "asc" },
      }),
      prisma.car.count({ where }),
    ]);

    return c.json({ cars, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    return c.json({ error: "Failed to fetch cars" }, 500);
  }
});

// Featured
app.get("/featured", async (c) => {
  try {
    const [jdm, supercar, classic] = await Promise.all([
      prisma.car.findMany({ where: { category: "JDM" }, include: { images: true }, take: 3 }),
      prisma.car.findMany({ where: { category: "SUPERCAR" }, include: { images: true }, take: 3 }),
      prisma.car.findMany({ where: { category: "CLASSIC" }, include: { images: true }, take: 3 }),
    ]);
    return c.json([...jdm, ...supercar, ...classic]);
  } catch (err) {
    return c.json({ error: "Failed to fetch featured cars" }, 500);
  }
});

// Search
app.get("/search", async (c) => {
  try {
    const q = c.req.query("q");
    if (!q) return c.json([]);

    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { make: { contains: q, mode: "insensitive" } },
          { model: { contains: q, mode: "insensitive" } },
          { tags: { has: q.toLowerCase() } },
        ],
      },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 20,
    });
    return c.json(cars);
  } catch (err) {
    return c.json({ error: "Search failed" }, 500);
  }
});

// Single car
app.get("/:slug", async (c) => {
  try {
    const car = await prisma.car.findUnique({
      where: { slug: c.req.param("slug") },
      include: {
        images: { orderBy: { isPrimary: "desc" } },
        variants: true,
      },
    });

    if (!car) return c.json({ error: "Car not found" }, 404);
    return c.json(car);
  } catch (err) {
    return c.json({ error: "Failed to fetch car" }, 500);
  }
});

export { app as carRoutes };