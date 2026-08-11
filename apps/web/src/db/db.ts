import { serverEnv } from "@/data/env/server";
import { createDb } from "@focus-me/db";

export const { db } = createDb(serverEnv.DATABASE_URL);
