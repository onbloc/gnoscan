import React from "react";

import { useMappedApiBlockEvents } from "@/common/services/block/use-mapped-api-block-events";

import { useMappedApiBlockTransactions } from "@/common/services/block/use-mapped-api-block-transactions";
import { FunctionFilterBar } from "../../common/function-filter/FunctionFilterBar";
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
  const height = String(blockHeight);
  const {
    data: transactions,
    isFetched: isFetchedTransactions,
    pagination: transactionsPagination,
    filter,
    setFilter,
  } = useMappedApiBlockTransactions(height);

  const { data: events, isFetched: isFetchedEvents, pagination: eventsPagination } = useMappedApiBlockEvents(height);

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
        size: transactionsPagination.totalCount ?? transactions.length,
      },
      {
        tabName: "Events",
        size: eventsPagination.totalCount ?? events.length,
      },
    ];
  }, [transactions, transactionsPagination.totalCount, events, eventsPagination.totalCount]);

  if (!isFetchedEvents || !isFetchedTransactions) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <>
          <FunctionFilterBar filter={filter} onChange={setFilter} />
          <BlockDetailDatatable
            transactions={transactions}
            isFetched={isFetchedTransactions}
            footer={<ListPagination {...transactionsPagination} />}
          />
        </>
      )}
      {currentTab === "Events" && (
        <StandardNetworkEventDatatable
          isFetched={isFetchedEvents}
          events={events}
          footer={<ListPagination {...eventsPagination} />}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkBlockInfo;
