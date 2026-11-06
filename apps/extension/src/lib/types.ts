import type { DomainSelectType } from "@focus-me/db";
import type { ApiResponse } from "@focus-me/lib/types";
import type { Session, User } from "better-auth";

export type SendResponse = (data: unknown) => void;

export type RuntimeMessageType =
  "GET_DOMAINS" | "START_WEB_SIGN_IN" | "GET_AUTH_SESSION" | "SIGN_OUT";

type DefineMappedTypes<T extends Record<RuntimeMessageType, unknown>> = {
  [K in RuntimeMessageType]: ApiResponse<T[K]>;
};

export type ExtensionAuthSession = {
  session: Session;
  user: User;
};

export type RuntimeMessageResponseTypeMap = DefineMappedTypes<{
  GET_DOMAINS: DomainSelectType[];
  START_WEB_SIGN_IN: ExtensionAuthSession | undefined | null;
  GET_AUTH_SESSION: ExtensionAuthSession | null;
  SIGN_OUT: undefined;
}>;
