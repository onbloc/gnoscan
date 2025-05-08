import React from "react";

import { Amount, GnoEvent, Transaction, TransactionContractInfo } from "@/types/data-type";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";

import DataListSection from "@/components/view/details-data-section/data-list-section";
import { StandardNetworkTransactionContractDetails } from "../../transaction-contract-details/StandardNetworkTransactionContractsDetails";
import { EventDatatable } from "@/components/view/datatable/event";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

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
  const { data: contractsData, isFetched: isFetchedContractsData } = useGetTransactionContractsByHeight(txHash);
  const { data: eventsData, isFetched: isFetchedEventsData } = useGetTransactionEventsByHeight(txHash);

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Contract",
      },
      {
        tabName: "Events",
        size: eventsData?.items?.length || 0,
      },
    ];
  }, [eventsData]);

  const txContracts: TransactionContractInfo = React.useMemo(() => {
    if (!contractsData) return { messages: [], numOfMessage: 0, rawContent: "" };

    return {
      messages: contractsData.items,
      numOfMessage: contractsData.items.length,
      rawContent: "",
    };
  }, [contractsData]);

  const txEvents: GnoEvent[] = React.useMemo(() => {
    if (!eventsData) return [];

    return TransactionMapper.transactionEventsFromApiResponses(eventsData.items || []);
  }, [eventsData]);

  if (!isFetchedContractsData || !isFetchedEventsData) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Contract" && (
        <StandardNetworkTransactionContractDetails
          transactionItem={txContracts}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          getTokenAmount={getTokenAmount}
        />
      )}
      {currentTab === "Events" && <EventDatatable events={txEvents} isFetched={isFetchedEventsData} />}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
