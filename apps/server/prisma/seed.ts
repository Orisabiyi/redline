import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
import { prisma } from "../src/lib/db";
import { cars } from "./seed-data";

dotenv.config();

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_DATABASE_URL!,
});

async function main() {
  console.log("🏎️  Seeding Redline database...\n");

  for (const car of cars) {
    const { variants, ...carData } = car;

    const created = await prisma.car.upsert({
      where: { slug: carData.slug },
      update: carData,
      create: {
        ...carData,
        variants: {
          create: variants,
        },
      },
    });

    console.log(`  ✓ ${created.name}`);
  }

  console.log(`\n🏁 Seeded ${cars.length} cars`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());