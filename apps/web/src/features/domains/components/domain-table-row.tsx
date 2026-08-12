import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { DomainSelectType } from "@focus-me/db";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { DomainOptions } from "./domain-options";
import { formatDomainStatus } from "../lib/formatters";

export const DomainTableRow = ({ domain }: { domain: DomainSelectType }) => {
  const { label, icon: Icon } = formatDomainStatus(domain.status);

  return (
    <TableRow key={domain.id}>
      <TableCell>
        <Link href={`https://${domain.domain}`}>
          <span className="text-muted-foreground text-base">
            https://
            <span className="font-medium text-foreground">{domain.domain}</span>
          </span>
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Icon className="size-5" />
          <span className="text-base">{label}</span>
        </div>
      </TableCell>
      <TableCell className="text-base">
        {domain.selfNote ? (
          domain.selfNote
        ) : (
          <span className="text-muted-foreground italic">No note provided</span>
        )}
      </TableCell>
      <TableCell className="text-base">
        {domain.subjectNote ? (
          domain.subjectNote
        ) : (
          <span className="text-muted-foreground italic">No note provided</span>
        )}
      </TableCell>
      <TableCell>
        <DomainOptions domain={domain}>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        </DomainOptions>
      </TableCell>
    </TableRow>
  );
};
