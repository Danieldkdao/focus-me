import z from "zod";
import { domainStatuses } from "@focus-me/db";

export const domainSchema = z.object({
  // todo: write a custom url/domain regex verification schema for this domain field
  domain: z.string().trim().min(1, { error: "Please enter a domain." }),
  status: z.enum(domainStatuses),
  selfNote: z.string().nullish(),
  subjectNote: z.string().nullish(),
});
export type DomainSchemaType = z.infer<typeof domainSchema>;
