import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { env } from "./config.js";
import { drizzle } from "drizzle-orm/neon-serverless";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
});
