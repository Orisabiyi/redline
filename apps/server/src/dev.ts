import { serve } from "@hono/node-server";
import app from "./index";

const port = parseInt(process.env.PORT || "5000");

serve({ fetch: app.fetch, port }, () => {
  console.log(`🏎️  Redline API running on http://localhost:${port}`);
});