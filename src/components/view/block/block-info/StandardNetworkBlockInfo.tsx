import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { useMappedApiBlockEvents } from "@/common/services/block/use-mapped-api-block-events";

import { useMappedApiBlockTransactions } from "@/common/services/block/use-mapped-api-block-transactions";
import { ListPagination } from "../../common/list-pagination/ListPagination";
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
  const scope = String(blockHeight);
  const [transactionsPage, setTransactionsPage] = useListPagination("block-transactions", scope);
  const [eventsPage, setEventsPage] = useListPagination("block-events", scope);

  const {
    data: transactions,
    totalCount: transactionsTotalCount,
    hasNext: transactionsHasNext,
    isFetched: isFetchedTransactions,
    isPreviousData: isTransactionsPreviousData,
  } = useMappedApiBlockTransactions({ blockHeight: scope, page: transactionsPage });

  const {
    data: events,
    totalCount: eventsTotalCount,
    hasNext: eventsHasNext,
    isFetched: isFetchedEvents,
    isPreviousData: isEventsPreviousData,
  } = useMappedApiBlockEvents({ blockHeight: scope, page: eventsPage });

  // Rows of the previous page stay on screen while the next page loads, so only the first load shows a skeleton.
  const isTransactionsReady = isFetchedTransactions || isTransactionsPreviousData;
  const isEventsReady = isFetchedEvents || isEventsPreviousData;

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
        size: transactionsTotalCount ?? transactions.length,
      },
      {
        tabName: "Events",
        size: eventsTotalCount ?? events.length,
      },
    ];
  }, [transactions, transactionsTotalCount, events, eventsTotalCount]);

  if (!isEventsReady || !isTransactionsReady) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <BlockDetailDatatable
          transactions={transactions}
          isFetched={isTransactionsReady}
          footer={
            <ListPagination
              page={transactionsPage}
              pageSize={DEFAULT_LIST_ITEMS_SIZE}
              totalCount={transactionsTotalCount}
              hasNext={transactionsHasNext}
              isSettled={!isTransactionsPreviousData}
              scope={scope}
              onChangePage={setTransactionsPage}
            />
          }
        />
      )}
      {currentTab === "Events" && (
        <StandardNetworkEventDatatable
          isFetched={isEventsReady}
          events={events}
          footer={
            <ListPagination
              page={eventsPage}
              pageSize={DEFAULT_LIST_ITEMS_SIZE}
              totalCount={eventsTotalCount}
              hasNext={eventsHasNext}
              isSettled={!isEventsPreviousData}
              scope={scope}
              onChangePage={setEventsPage}
            />
          }
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkBlockInfo;
