// src/routes/cars.ts
import { Hono } from "hono";
import { getDb } from "../lib/db";
import { Category } from "../../generated/prisma/enums";
import { Bindings, Variables } from "..";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// get all cars
app.get("/", async (context) => {
  try {
    const prisma = getDb(context.env.DATABASE_URL);
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
    return context.json({ error: "Failed to fetch cars" }, 500);
  }
});

// get featured cars for homepage
app.get("/featured", async (context) => {
  try {
    const prisma = getDb(context.env.DATABASE_URL);

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
    const prisma = getDb(context.env.DATABASE_URL);
    const query = context.req.query("q");
    if (!query) return context.json([]);

    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { make: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
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
  try {
    const prisma = getDb(context.env.DATABASE_URL);
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