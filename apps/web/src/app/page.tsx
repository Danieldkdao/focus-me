import { Button } from "@/components/ui/button";
import { DomainDialog } from "@/features/domains/components/domain-dialog";
import { DomainsListView } from "@/features/domains/components/domains-list-view";

const HomePage = () => {
  return (
    <div>
      <DomainDialog>
        <Button>Add Domain</Button>
      </DomainDialog>
      <DomainsListView />
    </div>
  );
};

export default HomePage;
