import { cars } from "./seed-data.js";
import { pool, prisma } from "../src/lib/db.js";

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
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });