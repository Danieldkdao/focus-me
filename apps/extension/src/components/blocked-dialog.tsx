import { getDomains } from "@/features/domains/actions/actions";
import { useQuery } from "@tanstack/react-query";
import { LockIcon, XCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSwap } from "./ui/loading-swap";
import { API_BASE_URL } from "@/lib/constants";
import { useState } from "react";

export const BlockedDialog = ({
  portalContainer,
}: {
  portalContainer: ShadowRoot;
}) => {
  const { session, signIn } = useAuth();
  const [open, setOpen] = useState(true);
  const { data } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const response = await getDomains();

      return response;
    },
  });

  if (window.location.href.startsWith(API_BASE_URL)) return null;

  if (!session) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent portalContainer={portalContainer}>
          <DialogHeader className="flex flex-col items-center gap-2">
            <LockIcon className="size-10" />
            <DialogTitle className="text-2xl font-semibold text-center">
              Hey There!
            </DialogTitle>
          </DialogHeader>
          <p className="text-lg text-muted-foreground text-center">
            Thank you for downloading the extension! To continue, sign in to
            your existing FocusMe account or create a new account if you don't
            have one already.
          </p>
          {signIn.error && (
            <p className="text-center font-medium text-lg text-destructive">
              {signIn.error.message}
            </p>
          )}
          <Button
            className="w-full"
            disabled={signIn.isPending}
            onClick={() => signIn.mutate()}
          >
            <LoadingSwap isLoading={signIn.isPending}>Sign In</LoadingSwap>
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (session) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent portalContainer={portalContainer}>
          <DialogHeader className="flex flex-col items-center gap-2">
            <LockIcon className="size-10" />
            <DialogTitle className="text-2xl font-semibold text-center">
              Congratulations!
            </DialogTitle>
          </DialogHeader>
          <p className="text-lg text-muted-foreground text-center">
            You are signed in! Now continue to the FocusMe website to keep
            going.
          </p>
          <Button
            className="w-full"
            render={
              <a href={`${API_BASE_URL}/dashboard`}>Continue to dashboard</a>
            }
          />
        </DialogContent>
      </Dialog>
    );
  }

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
