import { Suspense } from "react";
import { readDomainsAction } from "../actions/actions";

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

  return <div>{JSON.stringify(domains)}</div>;
};
