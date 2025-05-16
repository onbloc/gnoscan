import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { RealmDetailDatatable } from "../../datatable";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useGetRealmEventsByPath, useGetRealmTransactionsByPath } from "@/common/react-query/realm/api";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const {
    data: transactionData,
    isFetched: isFetchedTransactionData,
    hasNextPage: hasNextPageTransactionData,
    fetchNextPage: fetchNextPageTransactionData,
  } = useGetRealmTransactionsByPath({ path });
  const {
    data: eventData,
    isFetched: isFetchedEventData,
    hasNextPage: hasNextPageEventData,
    fetchNextPage: fetchNextPageEventData,
  } = useGetRealmEventsByPath({ path });

  const realmTransactions = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    const allItems = transactionData.pages.flatMap(page => page.items);
    return RealmMapper.realmTransactionFromApiResponses(allItems);
  }, [transactionData?.pages]);

  const realmEvents = React.useMemo(() => {
    if (!eventData?.pages) return [];

    const allItems = eventData.pages.flatMap(page => page.items);
    console.log(allItems, "allItems?");
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

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
          hasNextPage={hasNextPageTransactionData || false}
          nextPage={fetchNextPageTransactionData}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === "Events" && (
        <StandardNetworkEventDatatable
          isFetched={isFetchedEventData}
          events={realmEvents}
          hasNextPage={hasNextPageEventData}
          nextPage={fetchNextPageEventData}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkRealmInfo;
