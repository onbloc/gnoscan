import React from "react";

import { useRealm } from "@/common/hooks/realms/use-realm";
import { ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

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
        tabName: ACTIVITY_TAB.TRANSACTIONS,
        size: realmTransactions.length,
      },
      {
        tabName: ACTIVITY_TAB.EVENTS,
        size: transactionEvents.length,
      },
    ];
  }, [realmTransactions, transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <RealmDetailDatatable
          data={realmTransactions}
          isFetched={isFetchedTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === ACTIVITY_TAB.EVENTS && <EventDatatable isFetched={isFetched} events={transactionEvents} />}
    </DataListSection>
  );
};

export default CustomNetworkRealmInfo;
