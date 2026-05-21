import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { carRoutes } from "./routes/cars";
import { spotlightRoutes } from "./routes/spotlights";

const app = new Hono().basePath("/api/v1");

// Middleware
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

// Health check
app.get("/health", (c) => c.json({ status: "ok", version: "1.0.0" }));

export default app;