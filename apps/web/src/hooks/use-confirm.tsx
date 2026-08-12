import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactElement, useState } from "react";

export const useConfirm = (
  title: string,
  description: string,
): [ReactElement, () => Promise<boolean>] => {
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setPendingConfirmation({ resolve });
    });
  };

  const handleClose = () => {
    setPendingConfirmation(null);
  };

  const handleConfirm = () => {
    pendingConfirmation?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    pendingConfirmation?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = (
    <Dialog
      open={pendingConfirmation !== null}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full lg:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full lg:w-auto">
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
