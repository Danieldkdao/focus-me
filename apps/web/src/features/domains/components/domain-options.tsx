"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { showToast } from "@/lib/utils";
import { DomainSelectType } from "@focus-me/db";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useState, useTransition } from "react";
import { deleteDomainAction } from "../actions/actions";
import { DomainDialog } from "./domain-dialog";

export const DomainOptions = ({
  domain,
  children,
}: {
  domain: DomainSelectType;
  children: ReactElement;
}) => {
  const router = useRouter();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this domain?",
  );

  const handleDeletion = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;

    startTransition(async () => {
      const response = await deleteDomainAction(domain.id);
      if (response.error) {
        showToast("error", response.message);
      } else {
        showToast("success", response.message);
        router.refresh();
      }
    });
  };

  return (
    <>
      {ConfirmationDialog}
      <DomainDialog
        existingDomain={domain}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger render={children} />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDeletion}
            disabled={isPending}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
