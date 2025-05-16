import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { RealmDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useGetRealmEventsByPath, useGetRealmTransactionsByPath } from "@/common/react-query/realm/api";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const {
    data: transactionData,
    isFetched: isFetchedTransactionData,
    hasNextPage,
    fetchNextPage,
  } = useGetRealmTransactionsByPath({ path });
  const { data: eventData, isFetched: isFetchedEventData } = useGetRealmEventsByPath(path);

  const realmTransactions = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    const allItems = transactionData.pages.flatMap(page => page.items);
    return RealmMapper.realmTransactionFromApiResponses(allItems);
  }, [transactionData?.pages]);

  const realmEvents = React.useMemo(() => {
    if (!eventData?.items) return [];

    return RealmMapper.realmEventFromApiResponses(eventData.items);
  }, [eventData?.items]);

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: realmEvents.length,
      },
    ];
  }, [realmEvents]);

  if (!isFetchedTransactionData) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <RealmDetailDatatable
          data={realmTransactions}
          isFetched={isFetchedTransactionData}
          hasNextPage={hasNextPage || false}
          nextPage={fetchNextPage}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === "Events" && <EventDatatable isFetched={isFetchedEventData} events={realmEvents} />}
    </DataListSection>
  );
};

export default StandardNetworkRealmInfo;
