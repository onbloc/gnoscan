import React from "react";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
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
  const contracts = usePagedList(
    "tx-contracts",
    txHash,
    useGetTransactionContractsByHeight,
    { txHash },
    // Confirmed contracts never change, so pages already loaded by the transaction list are reused.
    { enabled: apiStatus === "confirmed", staleTime: Infinity },
  );
  const events = usePagedList(
    "tx-events",
    txHash,
    useGetTransactionEventsByHeight,
    { txHash },
    { enabled: apiStatus === "confirmed" },
  );

  // The summary card covers the whole transaction, so it keeps the first page of messages while the list pages.
  // On page 1 this is the same query as the list above.
  const { data: summaryContractsData, isFetched: isFetchedSummaryContracts } = useGetTransactionContractsByHeight(
    { txHash, page: 1 },
    { enabled: apiStatus === "confirmed", staleTime: Infinity },
  );

  const txContracts: TransactionContractInfo = React.useMemo(
    () => ({ messages: contracts.items, numOfMessage: contracts.totalCount ?? 0, rawContent: "" }),
    [contracts.items, contracts.totalCount],
  );

  const txEvents: GnoEvent[] = React.useMemo(
    () => TransactionMapper.transactionEventsFromApiResponses(events.items),
    [events.items],
  );

  const storageDepositInfo = React.useMemo(() => {
    if (!transactionEvents || transactionEvents.length === 0) {
      return null;
    }
    return extractStorageDepositFromTxEvents(transactionEvents);
  }, [transactionEvents]);

  // Events only exist once a tx has actually executed, so there's nothing to show —
  // or even a meaningful "0" for — while it's still pending. Drop the tab entirely
  // rather than rendering an empty table that reads as "confirmed, zero events".
  const detailTabs = React.useMemo(() => {
    const tabs: { tabName: string; size?: number }[] = [{ tabName: "Messages" }];

    if (!isPending) {
      tabs.push({ tabName: "Events", size: events.totalCount ?? txEvents.length });
    }

    return tabs;
  }, [isPending, events.totalCount, txEvents.length]);

  React.useEffect(() => {
    if (isPending && currentTab === "Events") {
      setCurrentTab("Messages");
    }
  }, [isPending, currentTab, setCurrentTab]);

  if (apiStatus !== "confirmed" && apiStatus !== "pending") return <TableSkeleton />;
  if (apiStatus === "confirmed" && (!contracts.isFetched || !isFetchedSummaryContracts || !events.isFetched))
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
              startIndex={contracts.startIndex}
              footer={<ListPagination {...contracts.pagination} />}
            />
          </>
        ))}
      {currentTab === "Events" && !isPending && (
        <StandardNetworkEventDatatable
          events={txEvents}
          isFetched={events.isFetched}
          footer={<ListPagination {...events.pagination} />}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
