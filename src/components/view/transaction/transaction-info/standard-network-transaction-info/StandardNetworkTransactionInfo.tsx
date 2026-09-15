import React from "react";

import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { useMappedApiTransaction } from "@/common/services/transaction/use-mapped-api-transaction";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { useGetTransactionEventsByHeight } from "@/common/react-query/transaction/api/use-get-transaction-events-by-hash";
import { GnoEvent, TransactionAction, TransactionContractInfo } from "@/types/data-type";

import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { extractStorageDepositFromTxEvents } from "@/common/utils/transaction.utility";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { EventDatatable } from "@/components/view/datatable/event";
import DataListSection from "@/components/view/details-data-section/data-list-section";
import { StandardNetworkTransactionContractDetails } from "../../transaction-contract-details/StandardNetworkTransactionContractsDetails";
import { TransactionContractDetails } from "../../transaction-contract-details/TransactionContractDetails";
import TransactionActionSummary from "../../transaction-message-summary/TransactionActionSummary";
import TransactionMessageSummary from "../../transaction-message-summary/TransactionMessageSummary";
import TransferSummaryLine from "../../transaction-message-summary/TransferSummaryLine";
import { getSingleTransferSummary } from "../../transaction-message-summary/transfer-render";

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
  const { transactionItem, transactionEvents } = transaction;

  const { data: apiTransaction, status: apiStatus } = useMappedApiTransaction(txHash);
  const isPending = apiStatus === "pending";
  const { getTokenAmount } = useTokenMeta();

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

  const summaryData = apiTransaction?.summary;
  const summaryActions = summaryData?.actions ?? [];

  // Synthesize a "deployPending" action per AddPkg message not yet covered by a real
  // enable/deploy action (backend has no action for it until EnablePackage succeeds).
  const pendingDeployActions: TransactionAction[] = React.useMemo(() => {
    if (!summaryData?.types.includes("deploy")) return [];

    const coveredPkgPaths = new Set(
      summaryActions.filter(action => action.type === "enable" || action.type === "deploy").map(action => action.realm),
    );

    return txContracts.messages
      .filter(message => message.messageType === MESSAGE_TYPES.VM_ADDPKG && !coveredPkgPaths.has(message.pkgPath))
      .map(
        (addPackageMessage): TransactionAction => ({
          tag: "vm",
          realm: addPackageMessage.pkgPath,
          type: "deployPending",
          assets: [
            { assetType: addPackageMessage.pkgPath, key: "packageName", value: addPackageMessage.name },
            { assetType: addPackageMessage.pkgPath, key: "creator", value: addPackageMessage.creator },
          ],
        }),
      );
  }, [summaryData?.types, summaryActions, txContracts.messages]);

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
  const eventTotalCount = eventsData?.pages?.[0]?.page?.totalCount;

  // Events only exist once a tx has actually executed, so there's nothing to show —
  // or even a meaningful "0" for — while it's still pending. Drop the tab entirely
  // rather than rendering an empty table that reads as "confirmed, zero events".
  const detailTabs = React.useMemo(() => {
    const tabs: { tabName: string; size?: number }[] = [{ tabName: "Messages" }];

    if (!isPending) {
      tabs.push({ tabName: "Events", size: eventTotalCount ?? txEvents.length });
    }

    return tabs;
  }, [isPending, eventsData, eventTotalCount, txEvents.length]);

  React.useEffect(() => {
    if (isPending && currentTab === "Events") {
      setCurrentTab("Messages");
    }
  }, [isPending, currentTab, setCurrentTab]);

  if (apiStatus !== "confirmed" && apiStatus !== "pending") return <TableSkeleton />;
  if (apiStatus === "confirmed" && (!isFetchedContractsData || !isFetchedEventsData)) return <TableSkeleton />;

  const displayActions = [...summaryActions, ...pendingDeployActions];
  const singleTransferSummary = getSingleTransferSummary(txContracts.numOfMessage, summaryData);

  const hasRenderableSummary = Boolean(
    summaryData &&
      (displayActions.length > 0 ||
        summaryData.transfers.some(transfer => transfer.assetType === "grc20") ||
        summaryData.netTransfers.some(transfer => transfer.assetType === "grc20")),
  );

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Messages" &&
        (isPending ? (
          <TransactionContractDetails
            transactionItem={apiTransaction.transactionItem}
            isDesktop={isDesktop}
            getUrlWithNetwork={getUrlWithNetwork}
            getTokenAmount={getTokenAmount}
          />
        ) : (
          <>
            {/* The single-transfer heading sits above "GRC-20 Transferred" in the same top
                summary slot as the action summary, instead of down in the per-message details. */}
            {(singleTransferSummary || hasRenderableSummary) && (
              <>
                <TransactionActionSummary actions={displayActions} />
                {singleTransferSummary && <TransferSummaryLine transfer={singleTransferSummary} />}
                {hasRenderableSummary && summaryData && (
                  <TransactionMessageSummary summary={summaryData} isDesktop={isDesktop} />
                )}
              </>
            )}
            <StandardNetworkTransactionContractDetails
              transactionItem={txContracts}
              rawTransaction={transactionItem}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
              storageDepositInfo={storageDepositInfo}
            />
          </>
        ))}
      {currentTab === "Events" && !isPending && <EventDatatable events={txEvents} isFetched={isFetchedEventsData} />}
    </DataListSection>
  );
};

export default StandardNetworkTransactionInfo;
