"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SetterType } from "@/lib/types";
import { DomainSelectType } from "@focus-me/db";
import { ReactElement, useState } from "react";
import { DomainForm } from "./domain-form";

export const DomainDialog = ({
  existingDomain,
  children,
  open,
  onOpenChange,
}: {
  existingDomain?: DomainSelectType;
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: SetterType<boolean>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openToUse = open ?? isOpen;
  const handleOpenChange = onOpenChange ?? setIsOpen;

  return (
    <Dialog open={openToUse} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingDomain ? "Update" : "Create"} Domain
          </DialogTitle>
          <DialogDescription className="sr-only">
            {existingDomain ? "Update" : "Create"} Domain
          </DialogDescription>
        </DialogHeader>
        <DomainForm
          existingDomain={existingDomain}
          afterAction={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
