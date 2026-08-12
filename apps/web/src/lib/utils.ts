import { toast, ToastType } from "@/components/ui/toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showToast = (
  type: ToastType,
  title: string,
  toastOptions?: Omit<Parameters<typeof toast.add>[0], "type" | "title">,
) => {
  toast.add({ type, title, ...(toastOptions ?? {}) });
};
