"use server";

import { db } from "@/db/db";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  GENERAL_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  UNAUTHED_ERROR_MESSAGE,
} from "@/lib/constants";
import { UnwrapAsync } from "@/lib/types";
import { DomainTable } from "@focus-me/db";
import { cacheTag } from "next/cache";
import { getUserDomainTag } from "../server/cache/domains";
import {
  confirmUserDomainOwnership,
  deleteDomainDb,
  insertDomainDb,
  updateDomainDb,
} from "../server/domains";
import { domainSchema, DomainSchemaType } from "./schemas";
import { eq } from "drizzle-orm";

const readCachedDomainsAction = async (userId: string) => {
  "use cache";
  cacheTag(getUserDomainTag(userId));
  const domains = await db
    .select()
    .from(DomainTable)
    .where(eq(DomainTable.userId, userId));

  return domains;
};
export const readDomainsAction = async () => {
  const { userId } = await getCurrentUser();
  if (!userId) return null;

  return readCachedDomainsAction(userId);
};
export type ReadDomainsActionRes = UnwrapAsync<typeof readDomainsAction>;

export const createDomainAction = async (unsafeData: DomainSchemaType) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: UNAUTHED_ERROR_MESSAGE,
    };
  }

  const { success, data } = domainSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_ERROR_MESSAGE,
    };
  }

  try {
    const insertedDomain = await insertDomainDb({ ...data, userId });
    if (!insertedDomain) throw new Error("Failed to create add new domain.");

    return {
      error: false,
      message: "Domain added successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const updateDomainAction = async (
  domainId: string,
  unsafeData: DomainSchemaType,
) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: UNAUTHED_ERROR_MESSAGE,
    };
  }

  const existingDomain = await confirmUserDomainOwnership(domainId);
  if (!existingDomain) {
    return {
      error: true,
      message: NOT_FOUND_ERROR_MESSAGE,
    };
  }

  const { success, data } = domainSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_ERROR_MESSAGE,
    };
  }

  try {
    const updatedDomain = await updateDomainDb(existingDomain.id, data);
    if (!updatedDomain) throw new Error("Failed to update domain.");

    return {
      error: false,
      message: "Domain updated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const deleteDomainAction = async (domainId: string) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: UNAUTHED_ERROR_MESSAGE,
    };
  }

  const existingDomain = await confirmUserDomainOwnership(domainId);
  if (!existingDomain) {
    return {
      error: true,
      message: NOT_FOUND_ERROR_MESSAGE,
    };
  }

  try {
    const deletedDomain = await deleteDomainDb(existingDomain.id);
    if (!deletedDomain) throw new Error("Failed to delete domain.");

    return {
      error: false,
      message: "Domain deleted successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};
