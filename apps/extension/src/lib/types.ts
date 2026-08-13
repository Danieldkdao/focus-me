import type { DomainSelectType } from "@focus-me/db";
import type { ApiResponse } from "@focus-me/lib/types";

export type RuntimeMessageType = "GET_DOMAINS";

type DefineMappedTypes<T extends Record<RuntimeMessageType, unknown>> = {
  [K in RuntimeMessageType]: ApiResponse<T[K]>;
};

export type RuntimeMessageResponseTypeMap = DefineMappedTypes<{
  GET_DOMAINS: DomainSelectType[];
}>;
