import { ExtensionConnectButton } from "@/components/extension-connect-button";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/helpers";
import { BanIcon, CircleXIcon, LinkIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type SearchParams = Promise<{
  state?: string;
  error?: string;
}>;

const ExtensionConnectPage = (props: { searchParams: SearchParams }) => {
  return (
    <div className="overflow-y-auto h-full w-full min-w-0">
      <div className="h-screen w-full min-w-0 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <Suspense>
            <ExtensionConnectSuspense {...props} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const ExtensionConnectSuspense = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { state, error } = await searchParams;

  if (!state || state.length < 32 || state.length > 256) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2">
          <BanIcon className="text-destructive size-12" />
          <h2 className="text-3xl font-semibold text-center">
            Invalid Authentication Request
          </h2>
          <p className="text-xl mt-1 text-muted-foreground text-center max-w-150">
            We did not recognize this authentication request. Retry the
            authentication from the extension or contact the developer to report
            an error with the webpage.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2">
          <CircleXIcon className="text-destructive size-12" />
          <h2 className="text-3xl font-semibold text-center">
            An Error Occurred
          </h2>
          <p className="text-xl mt-1 text-muted-foreground text-center max-w-150">
            Uh-oh. Looks like an unexpected error got in the way while we were
            trying to authenticate you. Retry the authentication process from
            the extension or report a bug to the developer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { userId, user, session } = await getCurrentUser();
  if (!userId || !user || !session) {
    const returnURL = `/extension/connect?state=${encodeURIComponent(state)}`;

    return redirect(`/sign-in?callbackURL=${encodeURIComponent(returnURL)}`);
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2">
        <LinkIcon className="size-12" />
        <h2 className="text-3xl font-semibold text-center">Connect FocusMe</h2>
        <p className="text-xl mt-1 text-muted-foreground text-center max-w-150">
          Would you like to connect the extension to your current signed-in
          account,{" "}
          <span className="font-medium text-foreground">{user.email}</span>?
          Make sure that you came from the official FocusMe extension and not
          anywhere else.
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <LinkButton href="/dashboard" variant="outline" className="w-full">
            Back
          </LinkButton>
          <ExtensionConnectButton state={state} className="w-full">
            Continue
          </ExtensionConnectButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtensionConnectPage;
