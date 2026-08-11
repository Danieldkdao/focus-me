import z from "zod";
import { domainStatuses } from "@focus-me/db";

export const domainSchema = z.object({
  domain: z.string(),
  status: z.enum(domainStatuses),
  selfNote: z.string().nullish(),
  subjectNote: z.string().nullish(),
});
export type DomainSchemaType = z.infer<typeof domainSchema>;
