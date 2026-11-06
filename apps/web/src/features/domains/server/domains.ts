import { db } from "@/db/db";
import { DomainInsertType, DomainSelectType, DomainTable } from "@focus-me/db";
import { revalidateDomainCache } from "./cache/domains";
import { SQLMap } from "@/lib/types";
import { and, eq, SQL } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/helpers";

export const confirmUserDomainOwnership = async (
  domainId: string,
  additionalFilters?: SQL<unknown>[],
) => {
  const { userId } = await getCurrentUser();
  if (!userId) return null;

  const existingDomain = await db.query.DomainTable.findFirst({
    where: and(
      eq(DomainTable.id, domainId),
      eq(DomainTable.userId, userId),
      ...(additionalFilters ?? []),
    ),
  });

  return existingDomain ?? null;
};

export const insertDomainDb = async (data: DomainInsertType) => {
  const [insertedDomain] = await db
    .insert(DomainTable)
    .values(data)
    .returning();

  revalidateDomainCache(insertedDomain.userId);

  return insertedDomain;
};

export const updateDomainDb = async (
  domainId: string,
  data: Partial<SQLMap<DomainSelectType>>,
) => {
  const existingDomain = await confirmUserDomainOwnership(domainId);
  if (!existingDomain) return null;

  const [updatedDomain] = await db
    .update(DomainTable)
    .set(data)
    .where(
      and(
        eq(DomainTable.id, existingDomain.id),
        eq(DomainTable.userId, existingDomain.userId),
      ),
    )
    .returning();

  revalidateDomainCache(updatedDomain.userId);

  return updatedDomain;
};

export const deleteDomainDb = async (domainId: string) => {
  const existingDomain = await confirmUserDomainOwnership(domainId);
  if (!existingDomain) return null;

  const [deletedDomain] = await db
    .delete(DomainTable)
    .where(
      and(
        eq(DomainTable.id, existingDomain.id),
        eq(DomainTable.userId, existingDomain.userId),
      ),
    )
    .returning();

  revalidateDomainCache(deletedDomain.userId);

  return deletedDomain;
};
