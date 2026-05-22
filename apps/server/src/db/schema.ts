import { pgTable, text, integer, real, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("Category", ["JDM", "SUPERCAR", "CLASSIC"]);

export const cars = pgTable("Car", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  endYear: integer("endYear"),
  category: categoryEnum("category").notNull(),
  engine: text("engine").notNull(),
  displacement: real("displacement"),
  horsepower: integer("horsepower"),
  torque: integer("torque"),
  transmission: text("transmission"),
  drivetrain: text("drivetrain"),
  weight: integer("weight"),
  zeroToSixty: real("zeroToSixty"),
  topSpeed: integer("topSpeed"),
  unitsProduced: integer("unitsProduced"),
  tagline: text("tagline"),
  story: text("story"),
  funFacts: text("funFacts").array(),
  tags: text("tags").array(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const images = pgTable("Image", {
  id: text("id").primaryKey(),
  carId: text("carId").notNull().references(() => cars.id),
  url: text("url").notNull(),
  source: text("source").notNull(),
  attribution: text("attribution"),
  isPrimary: boolean("isPrimary").default(false),
});

export const variants = pgTable("Variant", {
  id: text("id").primaryKey(),
  carId: text("carId").notNull().references(() => cars.id),
  name: text("name").notNull(),
  horsepower: integer("horsepower"),
  notes: text("notes"),
});