import React from "react";

import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { useMappedApiTransaction } from "@/common/services/transaction/use-mapped-api-transaction";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";
import { GnoEvent, TransactionContractInfo } from "@/types/data-type";

import { extractStorageDepositFromTxEvents } from "@/common/utils/transaction.utility";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { EventDatatable } from "@/components/view/datatable/event";
import DataListSection from "@/components/view/details-data-section/data-list-section";
import { ViewMoreButton } from "@/components/ui/button";
import { StandardNetworkTransactionContractDetails } from "../../transaction-contract-details/StandardNetworkTransactionContractsDetails";
import { TransactionContractDetails } from "../../transaction-contract-details/TransactionContractDetails";
import TransactionMessageSummary from "../../transaction-message-summary/TransactionMessageSummary";

interface TransactionInfoProps {
  txHash: string;
  currentTab: string;
  isDesktop: boolean;
  setCurrentTab: (tab: string) => void;
  getUrlWithNetwork: (uri: string) => string;
}

// Messages and Events used to be separate tabs. Both are "raw detail you rarely need"
// once `summary` exists to answer "what happened" up front, so they're now merged behind
// one "Show Details" toggle (Terra Finder-style) instead of a tab switcher. Named "Details"
// rather than "Logs" so it doesn't collide with the per-message raw-log "Show Logs" toggle
// (`ShowLog`) that can appear inside the revealed message cards.
const StandardNetworkTransactionInfo = ({ txHash, isDesktop, getUrlWithNetwork }: TransactionInfoProps) => {
  const { transaction } = useTransaction(txHash);
  const { transactionItem, transactionEvents } = transaction;

  const { data: apiTransaction, status: apiStatus } = useMappedApiTransaction(txHash);
  const isPending = apiStatus === "pending";
  const { getTokenAmount } = useTokenMeta();
  const [showLogs, setShowLogs] = React.useState(false);
  const [logsTab, setLogsTab] = React.useState("Messages");

  // Contracts/events only exist once the tx is confirmed and indexed — fetching them
  // any earlier (e.g. during the not-yet-settled grace window right after a 404) would
  // just get back an empty success response and flash an empty tab.
  const { data: contractsData, isFetched: isFetchedContractsData } = useGetTransactionContractsByHeight(
    { txHash },
    { enabled: apiStatus === "confirmed" },
  );
  const { data: eventsData, isFetched: isFetchedEventsData } = useGetTransactionEventsByHeight(
    { txHash },
    { enabled: apiStatus === "confirmed" },
  );

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

  const storageDepositInfo = React.useMemo(() => {
    if (!transactionEvents || transactionEvents.length === 0) {
      return null;
    }
    return extractStorageDepositFromTxEvents(transactionEvents);
  }, [transactionEvents]);

  // The API returns the total event count only on the first page.
  const eventTotalCount = eventsData?.pages?.[0]?.page?.totalCount ?? txEvents.length;

  if (apiStatus !== "confirmed" && apiStatus !== "pending") return <TableSkeleton />;
  if (apiStatus === "confirmed" && (!isFetchedContractsData || !isFetchedEventsData)) return <TableSkeleton />;

  // Collapsing Messages/Events behind "Show Logs" is only a win when `summary` actually
  // gives the user something to look at instead — an old API response, an unparseable tx,
  // or a summary with every field empty must fall back to the pre-existing always-open
  // view, or the page would default to showing almost nothing but a button.
  const summaryData = apiTransaction?.summary;
  const hasRenderableSummary = Boolean(
    summaryData &&
      (summaryData.types.length > 0 || summaryData.transfers.length > 0 || summaryData.netTransfers.length > 0),
  );

  const logsButtonText = showLogs
    ? "Hide Details"
    : `Show Details (Messages ${txContracts.numOfMessage} · Events ${eventTotalCount})`;

  const logsContent = (
    <DataListSection
      tabs={[{ tabName: "Messages" }, { tabName: "Events", size: eventTotalCount }]}
      currentTab={logsTab}
      setCurrentTab={setLogsTab}
    >
      {logsTab === "Messages" && (
        <StandardNetworkTransactionContractDetails
          transactionItem={txContracts}
          rawTransaction={transactionItem}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          storageDepositInfo={storageDepositInfo}
        />
      )}
      {logsTab === "Events" && <EventDatatable events={txEvents} isFetched={isFetchedEventsData} />}
    </DataListSection>
  );

  return (
    <DataListSection tabs={[{ tabName: "Activity" }]} currentTab="Activity" setCurrentTab={() => undefined}>
      {isPending ? (
        <TransactionContractDetails
          transactionItem={apiTransaction.transactionItem}
          isDesktop={isDesktop}
          getUrlWithNetwork={getUrlWithNetwork}
          getTokenAmount={getTokenAmount}
        />
      ) : summaryData && hasRenderableSummary ? (
        <>
          <TransactionMessageSummary summary={summaryData} isDesktop={isDesktop} />
          {showLogs && logsContent}
          <ViewMoreButton text={logsButtonText} onClick={() => setShowLogs(prev => !prev)} />
        </>
      ) : (
        logsContent
      )}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
