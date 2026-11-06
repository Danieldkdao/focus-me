import { getGlobalTag, getUserResourceTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getGlobalDomainTag = () => {
  return getGlobalTag("domains");
};

export const getUserDomainTag = (userId: string) => {
  return getUserResourceTag(userId, "domains");
};

export const revalidateDomainCache = (userId: string) => {
  revalidateTag(getGlobalDomainTag(), { expire: 0 });
  revalidateTag(getUserDomainTag(userId), { expire: 0 });
};
