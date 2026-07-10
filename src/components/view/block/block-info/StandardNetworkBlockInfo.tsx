import React from "react";

import { useMappedApiBlockEvents } from "@/common/services/block/use-mapped-api-block-events";

import { useMappedApiBlockTransactions } from "@/common/services/block/use-mapped-api-block-transactions";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { BlockDetailDatatable } from "../../datatable";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import DataListSection from "../../details-data-section/data-list-section";

interface BlockInfoProps {
  blockHeight: number;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkBlockInfo = ({ blockHeight, currentTab, setCurrentTab }: BlockInfoProps) => {
  const {
    data: transactions,
    isFetched: isFetchedTransactions,
    hasNextPage: transactionsHasNextPage,
    fetchNextPage: transactionsFetchNextPage,
  } = useMappedApiBlockTransactions({
    blockHeight: String(blockHeight),
  });

  const {
    data: events,
    totalCount: eventsTotalCount,
    isFetched: isFetchedEvents,
    hasNextPage: eventsHasNextpage,
    fetchNextPage: eventsFetchNextPage,
  } = useMappedApiBlockEvents({ blockHeight: String(blockHeight) });

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: eventsTotalCount ?? events.length,
      },
    ];
  }, [events, eventsTotalCount]);

  if (!isFetchedEvents || !isFetchedTransactions) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <BlockDetailDatatable
          transactions={transactions}
          isFetched={isFetchedTransactions}
          hasNextPage={transactionsHasNextPage}
          nextPage={transactionsFetchNextPage}
        />
      )}
      {currentTab === "Events" && (
        <StandardNetworkEventDatatable
          isFetched={isFetchedEvents}
          events={events}
          hasNextPage={eventsHasNextpage}
          nextPage={eventsFetchNextPage}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkBlockInfo;
