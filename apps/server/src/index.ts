import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { carRoutes } from "./routes/cars";
import { spotlightRoutes } from "./routes/spotlights";

export type Bindings = {
  DATABASE_URL: string;
  DIRECT_DATABASE_URL: string;
  NODE_ENV: string;
};

export type Variables = {
  db: ReturnType<typeof import("./lib/db.js").getDb>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath("/api/v1");

// Middleware
app.use("*", prettyJSON({ space: 2 }));
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:8081", "http://localhost:3000", "https://redline.app"],
  })
);

// Routes
app.route("/cars", carRoutes);
app.route("/spotlights", spotlightRoutes);


app.get("/health", (context) => context.json({ status: "ok", version: "1.0.0" }));

export default app;