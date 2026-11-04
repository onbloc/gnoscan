import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { useMappedApiTransaction } from "@/common/services/transaction/use-mapped-api-transaction";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";
import { GnoEvent, TransactionContractInfo } from "@/types/data-type";

import { extractStorageDepositFromTxEvents } from "@/common/utils/transaction.utility";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "@/components/view/datatable/event/StandardNetworkEventDatatable";
import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import DataListSection from "@/components/view/details-data-section/data-list-section";
import { StandardNetworkTransactionContractDetails } from "../../transaction-contract-details/StandardNetworkTransactionContractsDetails";
import { TransactionContractDetails } from "../../transaction-contract-details/TransactionContractDetails";
import TransactionTopSummary from "../../transaction-message-summary/TransactionTopSummary";

interface TransactionInfoProps {
  txHash: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkTransactionInfo = ({
  txHash,
  currentTab,
  setCurrentTab,
  getUrlWithNetwork,
}: TransactionInfoProps) => {
  const { transaction } = useTransaction(txHash);
  const { transactionItem, transactionEvents } = transaction;

  const { data: apiTransaction, status: apiStatus } = useMappedApiTransaction(txHash);
  const isPending = apiStatus === "pending";
  const { getTokenAmount } = useTokenMeta();

  // Contracts/events only exist once the tx is confirmed and indexed — fetching them
  // any earlier (e.g. during the not-yet-settled grace window right after a 404) would
  // just get back an empty success response and flash an empty tab.
  const [contractsPage, setContractsPage] = useListPagination("tx-contracts", txHash);
  const [eventsPage, setEventsPage] = useListPagination("tx-events", txHash);
  const {
    data: contractsData,
    isFetched: isFetchedContractsData,
    isPreviousData: isContractsPreviousData,
  } = useGetTransactionContractsByHeight(
    { txHash, page: contractsPage },
    // Confirmed contracts never change, so pages already loaded by the transaction list are reused.
    { enabled: apiStatus === "confirmed", staleTime: Infinity },
  );
  const {
    data: eventsData,
    isFetched: isFetchedEventsData,
    isPreviousData: isEventsPreviousData,
  } = useGetTransactionEventsByHeight({ txHash, page: eventsPage }, { enabled: apiStatus === "confirmed" });

  // The summary card covers the whole transaction, so it keeps the first page of messages while the list pages.
  // On page 1 this is the same query as the list above.
  const { data: summaryContractsData, isFetched: isFetchedSummaryContracts } = useGetTransactionContractsByHeight(
    { txHash, page: 1 },
    { enabled: apiStatus === "confirmed", staleTime: Infinity },
  );

  const txContracts: TransactionContractInfo = React.useMemo(
    () => ({
      messages: contractsData?.items ?? [],
      numOfMessage: contractsData?.page.totalCount ?? 0,
      rawContent: "",
    }),
    [contractsData],
  );

  const txEvents: GnoEvent[] = React.useMemo(
    () => (eventsData ? TransactionMapper.transactionEventsFromApiResponses(eventsData.items) : []),
    [eventsData],
  );

  const storageDepositInfo = React.useMemo(() => {
    if (!transactionEvents || transactionEvents.length === 0) {
      return null;
    }
    return extractStorageDepositFromTxEvents(transactionEvents);
  }, [transactionEvents]);

  const eventTotalCount = eventsData?.page.totalCount;

  // Events only exist once a tx has actually executed, so there's nothing to show —
  // or even a meaningful "0" for — while it's still pending. Drop the tab entirely
  // rather than rendering an empty table that reads as "confirmed, zero events".
  const detailTabs = React.useMemo(() => {
    const tabs: { tabName: string; size?: number }[] = [{ tabName: "Messages" }];

    if (!isPending) {
      tabs.push({ tabName: "Events", size: eventTotalCount ?? txEvents.length });
    }

    return tabs;
  }, [isPending, eventTotalCount, txEvents.length]);

  React.useEffect(() => {
    if (isPending && currentTab === "Events") {
      setCurrentTab("Messages");
    }
  }, [isPending, currentTab, setCurrentTab]);

  if (apiStatus !== "confirmed" && apiStatus !== "pending") return <TableSkeleton />;
  if (apiStatus === "confirmed" && (!isFetchedContractsData || !isFetchedSummaryContracts || !isFetchedEventsData))
    return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Messages" &&
        (isPending ? (
          <TransactionContractDetails
            transactionItem={apiTransaction.transactionItem}
            getUrlWithNetwork={getUrlWithNetwork}
            getTokenAmount={getTokenAmount}
          />
        ) : (
          <>
            <TransactionTopSummary
              messages={summaryContractsData?.items ?? []}
              numOfMessage={txContracts.numOfMessage}
              summary={apiTransaction?.summary}
            />
            <StandardNetworkTransactionContractDetails
              transactionItem={txContracts}
              rawTransaction={transactionItem}
              getUrlWithNetwork={getUrlWithNetwork}
              storageDepositInfo={storageDepositInfo}
              startIndex={(contractsPage - 1) * DEFAULT_LIST_ITEMS_SIZE}
              footer={
                <ListPagination
                  page={contractsPage}
                  pageSize={DEFAULT_LIST_ITEMS_SIZE}
                  totalCount={contractsData?.page.totalCount}
                  hasNext={contractsData?.page.hasNext}
                  isSettled={!isContractsPreviousData}
                  scope={txHash}
                  onChangePage={setContractsPage}
                />
              }
            />
          </>
        ))}
      {currentTab === "Events" && !isPending && (
        <StandardNetworkEventDatatable
          events={txEvents}
          isFetched={isFetchedEventsData}
          footer={
            <ListPagination
              page={eventsPage}
              pageSize={DEFAULT_LIST_ITEMS_SIZE}
              totalCount={eventsData?.page.totalCount}
              hasNext={eventsData?.page.hasNext}
              isSettled={!isEventsPreviousData}
              scope={txHash}
              onChangePage={setEventsPage}
            />
          }
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
