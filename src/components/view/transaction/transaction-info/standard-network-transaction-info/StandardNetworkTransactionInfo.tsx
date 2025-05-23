import React from "react";

import { GnoEvent, TransactionContractInfo } from "@/types/data-type";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";

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
}

const StandardNetworkTransactionInfo = ({
  txHash,
  isDesktop,
  currentTab,
  setCurrentTab,
  getUrlWithNetwork,
}: TransactionInfoProps) => {
  const { transaction } = useTransaction(txHash);
  const { transactionItem } = transaction;

  const { data: contractsData, isFetched: isFetchedContractsData } = useGetTransactionContractsByHeight({ txHash });
  const { data: eventsData, isFetched: isFetchedEventsData } = useGetTransactionEventsByHeight({ txHash });

  const txContracts: TransactionContractInfo = React.useMemo(() => {
    if (!contractsData?.pages) return { messages: [], numOfMessage: 0, rawContent: "" };

    const allItems = contractsData.pages.flatMap(page => page.items);
    return {
      messages: allItems,
      numOfMessage: allItems.length,
      rawContent: "",
    };
  }, [contractsData?.pages]);

  const txEvents: GnoEvent[] = React.useMemo(() => {
    if (!eventsData?.pages) return [];

    const allItems = eventsData.pages.flatMap(page => page.items);
    return TransactionMapper.transactionEventsFromApiResponses(allItems || []);
  }, [eventsData?.pages]);
  console.log(txEvents, "txEvents");

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Messages",
      },
      {
        tabName: "Events",
        size: txEvents.length || 0,
      },
    ];
  }, [eventsData]);

  if (!isFetchedContractsData || !isFetchedEventsData) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Messages" && (
        <StandardNetworkTransactionContractDetails
          transactionItem={txContracts}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          showLog={transactionItem?.rawContent}
        />
      )}
      {currentTab === "Events" && <EventDatatable events={txEvents} isFetched={isFetchedEventsData} />}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
