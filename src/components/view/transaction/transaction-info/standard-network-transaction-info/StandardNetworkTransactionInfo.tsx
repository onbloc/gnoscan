import React from "react";

import { Amount, GnoEvent, Transaction, TransactionContractInfo } from "@/types/data-type";

import DataListSection from "@/components/view/details-data-section/data-list-section";
import { TransactionContractDetails } from "../../transaction-contract-details/TransactionContractDetails";
import { EventDatatable } from "@/components/view/datatable/event";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";

interface TransactionInfoProps {
  txHash: string;
  currentTab: string;
  isDesktop: boolean;
  setCurrentTab: (tab: string) => void;
  getUrlWithNetwork: (uri: string) => string;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
}

const StandardNetworkTransactionInfo = ({
  txHash,
  isDesktop,
  currentTab,
  setCurrentTab,
  getUrlWithNetwork,
  getTokenAmount,
}: TransactionInfoProps) => {
  const { data: transactionsData, isFetched: isFetchedTransactionsData } = useGetTransactionContractsByHeight(txHash);
  const { data: eventsData, isFetched: isFetchedEventsData } = useGetTransactionEventsByHeight(txHash);

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Contract",
      },
      {
        tabName: "Events",
        size: 0,
      },
    ];
  }, []);

  // const txContracts = TransactionMapper.transactionContractsFromApiResponses(data?.items || []);
  const txContracts: TransactionContractInfo = React.useMemo(() => {
    if (!transactionsData) return { messages: [], numOfMessage: 0, rawContent: "" };

    return {
      messages: transactionsData.items,
      numOfMessage: transactionsData.items.length,
      rawContent: "",
    };
  }, [transactionsData]);

  const txEvents: GnoEvent[] = React.useMemo(() => {
    if (!eventsData) return [];

    return TransactionMapper.transactionEventsFromApiResponses(eventsData.items || []);
  }, [eventsData]);

  if (!isFetchedTransactionsData || !isFetchedEventsData) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <TransactionContractDetails
        transactionItem={txContracts}
        isDesktop={isDesktop}
        getUrlWithNetwork={getUrlWithNetwork}
        getTokenAmount={getTokenAmount}
      />
      {currentTab === "Events" && <EventDatatable events={txEvents} isFetched={isFetchedEventsData} />}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
