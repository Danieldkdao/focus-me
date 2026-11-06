import type { SendResponse } from "@/lib/types";
import { fetcher, isError, serverURL } from "@/lib/utils";
import { domainApiSchema } from "@focus-me/db";
import z from "zod";

export const handleGetDomains = (sendResponse: SendResponse) => {
  fetcher(
    serverURL("/api/domains"),
    z.array(domainApiSchema),
    (data) => {
      sendResponse({ data, error: false });
    },
    (error) => {
      sendResponse({
        error: true,
        message: isError(error) ? error.message : "Request failed",
      });
    },
    {
      withAuth: true,
    },
  );
};
