import { fetcher } from "@/lib/utils";
import { domainApiSchema } from "@focus-me/db/schema";
import z from "zod";

chrome.runtime.onMessage.addListener(
  (
    message: { type: "GET_DOMAINS" },
    _sender,
    sendResponse: (response: unknown) => void,
  ) => {
    if (message.type !== "GET_DOMAINS") return;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      sendResponse({
        error: true,
        message: "VITE_API_BASE_URL is not configured.",
      });
      return;
    }

    fetcher(
      `${apiBaseUrl}/api/domains`,
      z.array(domainApiSchema),
      (data) => {
        sendResponse({ data, error: false });
      },
      (error) => {
        sendResponse({
          error: true,
          message: error instanceof Error ? error.message : "Request failed",
        });
      },
    );

    return true;
  },
);
