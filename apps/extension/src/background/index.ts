import type { RuntimeMessageType } from "@/lib/types";
import { handleGetDomains } from "./message-listeners/get-domains";
import { handleStartWebSignIn } from "./message-listeners/start-web-sign-in";
import { API_BASE_URL } from "@/lib/constants";
import { handleGetAuthSession } from "./message-listeners/get-auth-session";
import { handleSignOut } from "./message-listeners/sign-out";

chrome.runtime.onMessage.addListener(
  (
    message: { type: RuntimeMessageType },
    _sender,
    sendResponse: (response: unknown) => void,
  ) => {
    if (!API_BASE_URL) {
      sendResponse({
        error: true,
        message: "VITE_API_BASE_URL is not configured.",
      });
      return;
    }

    const messageType = message.type;

    switch (messageType) {
      case "GET_DOMAINS":
        handleGetDomains(sendResponse);
        break;
      case "START_WEB_SIGN_IN":
        handleStartWebSignIn(sendResponse);
        break;
      case "GET_AUTH_SESSION":
        handleGetAuthSession(sendResponse);
        break;
      case "SIGN_OUT":
        handleSignOut(sendResponse);
        break;
      default:
        throw new Error(`Unknown message type: ${messageType satisfies never}`);
    }

    return true;
  },
);
