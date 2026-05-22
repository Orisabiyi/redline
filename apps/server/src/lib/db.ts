import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });