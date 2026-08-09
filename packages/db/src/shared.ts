import { pgEnum } from "drizzle-orm/pg-core";

export const domainStatuses = ["allowed", "blocked"] as const;
export type DomainStatus = (typeof domainStatuses)[number];
export const domainStatusEnum = pgEnum("domain_statuses", domainStatuses);
