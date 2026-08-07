import { useState } from "react";
import { DialogContent, DialogTitle, Dialog, DialogHeader } from "./ui/dialog";

export const BlockedDialog = ({
  portalContainer,
}: {
  portalContainer: ShadowRoot;
}) => {
  const [blockedUrls] = useState<string[]>(["apple.com"]);

  const isBlocked = blockedUrls.some(
    (domain) =>
      window.location.hostname === domain ||
      window.location.hostname.endsWith(`.${domain}`),
  );

  return (
    <Dialog
      open={isBlocked}
      onOpenChange={(state) => {
        if (!state) return;
      }}
    >
      <DialogContent portalContainer={portalContainer} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-blue-500!">
            You are not allowed to visit this site!
          </DialogTitle>
        </DialogHeader>
        <p className="text-lg font-semibold text-muted-foreground text-center">
          Get back to work.
        </p>
      </DialogContent>
    </Dialog>
  );
};
