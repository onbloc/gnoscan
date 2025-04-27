import React from "react";

import { Amount, GnoEvent, Transaction } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { TransactionContractDetails } from "../transaction-contract-details/TransactionContractDetails";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface TransactionInfoProps {
  transactionEvents: GnoEvent[];
  transactionItem: Transaction | null;
  currentTab: string;
  isDesktop: boolean;
  isFetched: boolean;
  setCurrentTab: (tab: string) => void;
  getUrlWithNetwork: (uri: string) => string;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
  getName: (address: string) => string;
}

const TransactionInfo = ({
  transactionEvents,
  transactionItem,
  isDesktop,
  isFetched,
  currentTab,
  setCurrentTab,
  getUrlWithNetwork,
  getTokenAmount,
  getName,
}: TransactionInfoProps) => {
  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Contract",
      },
      {
        tabName: "Events",
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Contract" && (
        <TransactionContractDetails
          transactionItem={transactionItem}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          getTokenAmount={getTokenAmount}
          getName={getName}
        />
      )}
      {currentTab === "Events" && <EventDatatable events={transactionEvents} isFetched={isFetched} />}
    </DataListSection>
  );
};

export default TransactionInfo;
