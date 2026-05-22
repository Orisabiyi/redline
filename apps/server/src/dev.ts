import { serve } from "@hono/node-server";
import app from "./index";

const port = parseInt(process.env.PORT || "5000");

const originalFetch = app.fetch;
app.fetch = (req: Request, env?: any, ctx?: any) => {
  return originalFetch.call(app, req, {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    ...env,
  }, ctx);
};

serve({ fetch: app.fetch, port }, () => {
  console.log(`🏎️  Redline APIs running on http://localhost:${port}`);
});