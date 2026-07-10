import React from "react";

import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { useGetRealmEventsByPath, useGetRealmTransactionsByPath } from "@/common/react-query/realm/api";

import DataListSection from "../../details-data-section/data-list-section";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { RealmDetailDatatable } from "../../datatable";

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
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

  // The API returns the total event count only on the first page.
  const eventTotalCount = eventData?.pages?.[0]?.page?.totalCount;

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: eventTotalCount ?? realmEvents.length,
      },
    ];
  }, [realmEvents, eventTotalCount]);

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
