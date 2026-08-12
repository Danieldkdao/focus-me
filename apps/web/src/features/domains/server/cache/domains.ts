import { getGlobalTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getGlobalDomainTag = () => {
  return getGlobalTag("domains");
};

export const revalidateDomainCache = () => {
  revalidateTag(getGlobalDomainTag(), { expire: 0 });
};
