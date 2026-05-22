import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
// import ws from "ws";

// neonConfig.webSocketConstructor = ws;

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// const adapter = new PrismaNeon({
//   connectionString: process.env.DIRECT_DATABASE_URL!,
// });

let prisma: PrismaClient | null = null;

export function getDb(connectionString: string): PrismaClient {
  if (!prisma) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}