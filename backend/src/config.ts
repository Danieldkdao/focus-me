import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    PORT: z
      .string()
      .default("8000")
      .transform((s) => parseInt(s))
      .pipe(z.number()),
  },
  isServer: true,
  runtimeEnv: process.env,
});
