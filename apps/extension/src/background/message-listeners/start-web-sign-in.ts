import { startWebSignIn } from "@/lib/auth/handle-auth";
import type { SendResponse } from "@/lib/types";
import { isError } from "@/lib/utils";

export const handleStartWebSignIn = (sendResponse: SendResponse) => {
  startWebSignIn()
    .then((session) => {
      sendResponse({
        error: false,
        data: {
          session,
        },
      });
    })
    .catch((error) => {
      sendResponse({
        error: true,
        message: isError(error) ? error.message : "Authentication failed.",
      });
    });
};
