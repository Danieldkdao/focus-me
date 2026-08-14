import { createAuthClient } from "better-auth/client";
import { emailOTPClient, oneTimeTokenClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), oneTimeTokenClient()],
});
