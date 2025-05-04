import React from "react";

import { GnoEvent } from "@/types/data-type";
import { useRealm } from "@/common/hooks/realms/use-realm";

import DataListSection from "../../details-data-section/data-list-section";
import { RealmDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const CustomNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const { realmTransactions, isFetchedTransactions, hasNextPage, nextPage, transactionEvents, isFetched } =
    useRealm(path);

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <RealmDetailDatatable
          data={realmTransactions}
          isFetched={isFetchedTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === "Events" && <EventDatatable isFetched={isFetched} events={transactionEvents} />}
    </DataListSection>
  );
};

export default CustomNetworkRealmInfo;
