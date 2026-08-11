import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers.js";
import { domainStatusEnum } from "../shared.js";

export const DomainTable = pgTable("domains", {
  id,
  // todo: add user id
  domain: text("domain").notNull(),
  status: domainStatusEnum("status").notNull(),
  selfNote: text("self_note"),
  subjectNote: text("subject_note"),
  createdAt,
  updatedAt,
});

export type DomainInsertType = typeof DomainTable.$inferInsert;
export type DomainSelectType = typeof DomainTable.$inferSelect;
