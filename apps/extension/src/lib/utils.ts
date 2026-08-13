import z from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ApiResponse } from "@focus-me/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const responseSchema = <T extends z.ZodType>(
  dataSchema: T,
): z.ZodType<ApiResponse<z.output<T>>> =>
  z.discriminatedUnion("error", [
    z.object({
      error: z.literal(false),
      data: dataSchema,
    }),
    z.object({
      error: z.literal(true),
      message: z.string(),
    }),
  ]) as z.ZodType<ApiResponse<z.output<T>>>;

export const fetcher = async <T extends z.ZodType>(
  url: string,
  dataSchema: T,
  onData: (data: z.output<T>) => void,
  onError?: (error: unknown) => void,
) => {
  return fetch(url)
    .then(async (response) => {
      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);

      const unsafeData = await response.json();
      const result = responseSchema(dataSchema).safeParse(unsafeData);
      console.log(JSON.stringify(unsafeData));
      if (!result.success) throw new Error("Invalid data.");

      const data = result.data;

      if (data.error)
        throw new Error(
          `Request failed due to unexpected error: ${data.message}`,
        );

      onData(data.data);

      return data.data;
    })
    .catch((error) => {
      console.error(error);
      onError?.(error);
    });
};
