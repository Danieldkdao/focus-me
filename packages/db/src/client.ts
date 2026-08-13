import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export const createDb = (databaseUrl: string) => {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  return { pool, db };
};
