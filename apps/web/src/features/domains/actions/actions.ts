"use server";

import {
  GENERAL_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
} from "@/lib/constants";
import { domainSchema, DomainSchemaType } from "./schemas";
import {
  confirmUserDomainOwnership,
  deleteDomainDb,
  insertDomainDb,
  updateDomainDb,
} from "../server/domains";

export const createDomainAction = async (unsafeData: DomainSchemaType) => {
  const { success, data } = domainSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_ERROR_MESSAGE,
    };
  }

  try {
    const insertedDomain = await insertDomainDb(data);
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
