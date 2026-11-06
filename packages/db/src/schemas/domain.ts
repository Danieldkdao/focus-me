import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { domainStatusEnum } from "../shared";
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import z from "zod";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const DomainTable = pgTable("domains", {
  id,
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  domain: text("domain").notNull(),
  status: domainStatusEnum("status").notNull(),
  selfNote: text("self_note"),
  subjectNote: text("subject_note"),
  createdAt,
  updatedAt,
});

export type DomainInsertType = typeof DomainTable.$inferInsert;
export type DomainSelectType = typeof DomainTable.$inferSelect;

export const domainInsertSchema = createInsertSchema(DomainTable);
export const domainUpdateSchema = createUpdateSchema(DomainTable);
export const domainSelectSchema = createSelectSchema(DomainTable);

export const domainApiSchema = domainSelectSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const domainRelations = relations(DomainTable, ({ one }) => ({
  user: one(user, {
    fields: [DomainTable.userId],
    references: [user.id],
  }),
}));
