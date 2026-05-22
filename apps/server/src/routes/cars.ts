// src/routes/cars.ts
import { Hono } from "hono";
import { prisma } from "../lib/db";
import { Category } from "../../generated/prisma/enums";

const app = new Hono();

// List cars
app.get("/", async (context) => {
  console.log("Fetching cars with query:", context.req.query());
  try {
    const { category, page = "1", limit = "20" } = context.req.query();

    const where =
      category && Object.values(Category).includes(category as Category)
        ? { category: category as Category }
        : {};
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

    return context.json({ cars, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error("Full error:", err);
    return context.json({ error: "Failed to fetch cars" }, 500);
  }
});

// Featured
app.get("/featured", async (context) => {
  try {
    const [jdm, supercar, classic] = await Promise.all([
      prisma.car.findMany({ where: { category: "JDM" }, include: { images: true }, take: 3 }),
      prisma.car.findMany({ where: { category: "SUPERCAR" }, include: { images: true }, take: 3 }),
      prisma.car.findMany({ where: { category: "CLASSIC" }, include: { images: true }, take: 3 }),
    ]);
    return context.json([...jdm, ...supercar, ...classic]);
  } catch (err) {
    return context.json({ error: "Failed to fetch featured cars" }, 500);
  }
});

// Search
app.get("/search", async (context) => {
  try {
    const q = context.req.query("q");
    if (!q) return context.json([]);

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
    return context.json(cars);
  } catch (err) {
    return context.json({ error: "Search failed" }, 500);
  }
});

// Single car
app.get("/:slug", async (context) => {
  console.log("Fetching car with slug:", context.req.param("slug"));
  try {
    const car = await prisma.car.findUnique({
      where: { slug: context.req.param("slug") },
      include: {
        images: { orderBy: { isPrimary: "desc" } },
        variants: true,
      },
    });

    if (!car) return context.json({ error: "Car not found" }, 404);
    return context.json(car);
  } catch (err) {
    return context.json({ error: "Failed to fetch car" }, 500);
  }
});

export { app as carRoutes };