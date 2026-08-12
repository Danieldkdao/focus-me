import { DomainStatus } from "@focus-me/db";
import { BanIcon, CheckIcon } from "lucide-react";

export const formatDomainStatus = (status: DomainStatus) => {
  switch (status) {
    case "allowed":
      return {
        label: "Allowed",
        icon: CheckIcon,
      };
    case "blocked":
      return {
        label: "Blocked",
        icon: BanIcon,
      };
    default:
      throw new Error(`Unknown domain status: ${status satisfies never}`);
  }
};
