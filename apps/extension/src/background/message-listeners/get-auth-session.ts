import { getAuthSession } from "@/lib/auth/handle-auth";
import type { SendResponse } from "@/lib/types";
import { isError } from "@/lib/utils";

export const handleGetAuthSession = (sendResponse: SendResponse) => {
  getAuthSession()
    .then((session) => {
      sendResponse({
        error: false,
        data: session,
      });
    })
    .catch((error) => {
      sendResponse({
        error: true,
        message: isError(error)
          ? error.message
          : "Failed to check authentication.",
      });
    });
};
