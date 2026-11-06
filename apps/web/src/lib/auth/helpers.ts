import { headers } from "next/headers";
import { auth } from "./auth";

export const getCurrentUser = async ({
  externalHeaders,
}: { externalHeaders?: Headers } = {}) => {
  const session = await auth.api.getSession({
    headers: externalHeaders ?? (await headers()),
  });

  return {
    userId: session?.user.id ?? null,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
};
