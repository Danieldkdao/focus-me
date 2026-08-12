import { db } from "@/db/db";
import { DomainInsertType, DomainSelectType, DomainTable } from "@focus-me/db";
import { revalidateDomainCache } from "./cache/domains";
import { SQLMap } from "@/lib/types";
import { and, eq, SQL } from "drizzle-orm";

export const confirmUserDomainOwnership = async (
  domainId: string,
  additionalFilters?: SQL<unknown>[],
) => {
  const existingDomain = await db.query.DomainTable.findFirst({
    where: and(eq(DomainTable.id, domainId), ...(additionalFilters ?? [])),
  });

  return existingDomain ?? null;
};

export const insertDomainDb = async (data: DomainInsertType) => {
  const [insertedDomain] = await db
    .insert(DomainTable)
    .values(data)
    .returning();

  revalidateDomainCache();

  return insertedDomain;
};

export const updateDomainDb = async (
  domainId: string,
  data: Partial<SQLMap<DomainSelectType>>,
) => {
  const [updatedDomain] = await db
    .update(DomainTable)
    .set(data)
    .where(eq(DomainTable.id, domainId))
    .returning();

  revalidateDomainCache();

  return updatedDomain;
};

export const deleteDomainDb = async (domainId: string) => {
  const [deletedDomain] = await db
    .delete(DomainTable)
    .where(eq(DomainTable.id, domainId))
    .returning();

  revalidateDomainCache();

  return deletedDomain;
};
