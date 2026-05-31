import { cars as seedCars } from "./seed-data.js";
import { getDb } from "../src/lib/db.js";
import { cars, variants } from "../src/db/schema.js";

const db = getDb(process.env.DATABASE_URL!);

async function main() {
  for (const car of seedCars) {
    const { variants: carVariants, ...carData } = car;
    const carId = crypto.randomUUID();

    const now = new Date();

    await db.insert(cars).values({
      ...carData,
      id: carId,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    if (carVariants?.length) {
      await db.insert(variants).values(
        carVariants.map((variant) => ({
          ...variant,
          id: crypto.randomUUID(),
          carId,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }
  }
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});