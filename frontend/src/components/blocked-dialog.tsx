import { useState } from "react";
import { DialogContent, DialogTitle, Dialog, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { XCircleIcon } from "lucide-react";

export const BlockedDialog = ({
  portalContainer,
}: {
  portalContainer: ShadowRoot;
}) => {
  const [allowedUrls] = useState<string[]>([
    "mathacademy.com",
    "www.google.com",
    "github.com",
  ]);

  const isAllowed = allowedUrls.some((domain) =>
    window.location.href.startsWith(`https://${domain}`),
  );

  return (
    <Dialog
      open={!isAllowed}
      onOpenChange={(state) => {
        if (!state) return;
      }}
    >
      <DialogContent portalContainer={portalContainer} showCloseButton={false}>
        <DialogHeader className="flex flex-col items-center gap-2">
          <XCircleIcon className="size-10" />
          <DialogTitle className="text-2xl font-semibold text-center">
            Hold on there.
          </DialogTitle>
        </DialogHeader>
        <p className="text-lg text-muted-foreground text-center">
          This is not where you should be. Please go back to working on Math
          Academy. {window.location.pathname} {window.location.href}{" "}
          {window.location.hostname}
        </p>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Button className="md:flex-1 w-full" variant="secondary">
            I need to visit this page.
          </Button>
          <Button
            className="md:flex-1 w-full"
            render={<a href="https://mathacademy.com">OK</a>}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
