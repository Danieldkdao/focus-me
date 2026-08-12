import { Button } from "@/components/ui/button";
import { DomainDialog } from "@/features/domains/components/domain-dialog";

const HomePage = () => {
  return (
    <div>
      <DomainDialog>
        <Button>Add Domain</Button>
      </DomainDialog>
    </div>
  );
};

export default HomePage;
