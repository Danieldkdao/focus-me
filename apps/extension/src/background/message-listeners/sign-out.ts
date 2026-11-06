import { signOutExtension } from "@/lib/auth/handle-auth";
import type { SendResponse } from "@/lib/types";
import { isError } from "@/lib/utils";

export const handleSignOut = (sendResponse: SendResponse) => {
  signOutExtension()
    .then(() => {
      sendResponse({
        error: false,
        data: undefined,
      });
    })
    .catch((error) => {
      sendResponse({
        error: true,
        message: isError(error) ? error.message : "Failed to sign out.",
      });
    });
};
