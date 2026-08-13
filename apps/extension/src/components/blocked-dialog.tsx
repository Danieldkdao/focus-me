import { getDomains } from "@/features/domains/actions/actions";
import { useQuery } from "@tanstack/react-query";
import { XCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const BlockedDialog = ({
  portalContainer,
}: {
  portalContainer: ShadowRoot;
}) => {
  const { data } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const response = await getDomains();

      return response;
    },
  });

  const match = data?.length
    ? data.find((domain) => {
        const hostname = window.location.hostname;
        const blockedDomain = domain.domain.toLowerCase().replace(/\.$/, "");
        const isMatch =
          hostname === blockedDomain || hostname.endsWith(`.${blockedDomain}`);
        return isMatch && domain.status === "blocked";
      })
    : undefined;

  return (
    <Dialog
      open={!!match}
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
          This is not where you should be. {match?.subjectNote}
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
