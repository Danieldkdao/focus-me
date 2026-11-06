"use client";

import { ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import { LoadingSwap } from "./ui/loading-swap";

export const ExtensionConnectButton = ({
  state,
  children,
  ...props
}: { state: string } & ComponentProps<typeof Button>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action="/api/extension/complete-auth"
      onSubmit={() => setIsSubmitting(true)}
      method="post"
    >
      <input type="hidden" name="state" value={state} />
      <Button {...props} type="submit" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>{children}</LoadingSwap>
      </Button>
    </form>
  );
};
