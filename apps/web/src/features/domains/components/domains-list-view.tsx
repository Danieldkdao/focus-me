import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import { readDomainsAction } from "../actions/actions";
import { DomainTableRow } from "./domain-table-row";

export const DomainsListView = () => {
  return (
    <Suspense fallback={<DomainsListViewLoading />}>
      <DomainsListViewSuspense />
    </Suspense>
  );
};

const DomainsListViewLoading = () => {
  return <div>loading</div>;
};

const DomainsListViewSuspense = async () => {
  const domains = await readDomainsAction();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Self Note</TableHead>
          <TableHead>Subject Note</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <DomainTableRow key={domain.id} domain={domain} />
        ))}
      </TableBody>
    </Table>
  );
};
