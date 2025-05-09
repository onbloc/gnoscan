import React from "react";

import { Amount, GnoEvent, Transaction } from "@/types/data-type";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";

import DataListSection from "@/components/view/details-data-section/data-list-section";
import { TransactionContractDetails } from "../../transaction-contract-details/TransactionContractDetails";
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

const CustomNetworkTransactionInfo = ({
  txHash,
  isDesktop,
  currentTab,
  setCurrentTab,
  getUrlWithNetwork,
  getTokenAmount,
}: TransactionInfoProps) => {
  const { transaction, isFetched } = useTransaction(txHash);
  const { transactionEvents, transactionItem } = transaction;

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Messages",
      },
      {
        tabName: "Events",
        size: 0,
      },
    ];
  }, [transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Messages" && (
        <TransactionContractDetails
          transactionItem={transactionItem}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          getTokenAmount={getTokenAmount}
          // getName={getName}
        />
      )}
      {currentTab === "Events" && <EventDatatable events={transactionEvents} isFetched={isFetched} />}
    </DataListSection>
  );
};

export default CustomNetworkTransactionInfo;
