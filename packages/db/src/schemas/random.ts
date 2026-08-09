import { pgTable, varchar } from "drizzle-orm/pg-core";

export const RandomTable = pgTable("random", {
  random: varchar("random"),
});
