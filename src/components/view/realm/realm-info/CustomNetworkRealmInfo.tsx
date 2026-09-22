import React from "react";

import { useRealm } from "@/common/hooks/realms/use-realm";

import DataListSection from "../../details-data-section/data-list-section";
import { DETAIL_TAB_NAME } from "../../details-data-section/detail-tab-name.constant";
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
        tabName: DETAIL_TAB_NAME.TRANSACTIONS,
        size: realmTransactions.length,
      },
      {
        tabName: DETAIL_TAB_NAME.EVENTS,
        size: transactionEvents.length,
      },
    ];
  }, [realmTransactions, transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <RealmDetailDatatable
          data={realmTransactions}
          isFetched={isFetchedTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.EVENTS && <EventDatatable isFetched={isFetched} events={transactionEvents} />}
    </DataListSection>
  );
};

export default CustomNetworkRealmInfo;
