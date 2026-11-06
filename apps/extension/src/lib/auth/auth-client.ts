import { createAuthClient } from "better-auth/react";
import { oneTimeTokenClient } from "better-auth/client/plugins";
import { API_BASE_URL } from "../constants";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [oneTimeTokenClient()],
});
