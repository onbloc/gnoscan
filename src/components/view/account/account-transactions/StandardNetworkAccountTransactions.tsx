import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import DataListSection from "../../details-data-section/data-list-section";
import AccountTransactionsSkeleton from "./AccountTransactionsSkeleton";
import { ActivityDatatable } from "../../datatable/activity";
import { useGetAccountDirectTransactions } from "@/common/react-query/account/api/use-get-account-direct-transactions";
import { useGetAccountNativeTransfers } from "@/common/react-query/account/api/use-get-account-native-transfers";
import { useGetAccountTokenTransfers } from "@/common/react-query/account/api/use-get-account-token-transfers";
import { ACCOUNT_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";
import { useTransactionFilter } from "@/common/hooks/transactions/use-transaction-filter";
import { useGetFunctionNames } from "@/common/react-query/transaction/api";
import { TransactionFilterBar } from "../../datatable/transaction-filter/TransactionFilterBar";

interface AccountTransactionsProps {
  address: string;
}

// keepPreviousData keeps the tabs mounted while a new filter loads, so the filter inputs keep focus.
const FILTERED_QUERY_OPTIONS = { keepPreviousData: true };

const StandardNetworkAccountTransactions = ({ address }: AccountTransactionsProps) => {
  // Each tab keeps its own filter, and its tab count follows it.
  // The Transactions tab filters by functions this account called, so it suggests only those.
  const { data: functionNameData } = useGetFunctionNames(address);
  const functionNames = React.useMemo(() => functionNameData?.items.map(item => item.name), [functionNameData]);
  const directFilter = useTransactionFilter(`account:${address}:filter:direct`, functionNames);
  const nativeFilter = useTransactionFilter(`account:${address}:filter:native`);
  const tokenFilter = useTransactionFilter(`account:${address}:filter:token`);

  const {
    data: directData,
    isFetched: isFetchedDirect,
    hasNextPage: hasNextPageDirect,
    fetchNextPage: fetchNextPageDirect,
  } = useGetAccountDirectTransactions({ address, ...directFilter.params }, FILTERED_QUERY_OPTIONS);
  const {
    data: nativeData,
    isFetched: isFetchedNative,
    hasNextPage: hasNextPageNative,
    fetchNextPage: fetchNextPageNative,
  } = useGetAccountNativeTransfers(
    { address, fromDate: nativeFilter.params.fromDate, toDate: nativeFilter.params.toDate },
    FILTERED_QUERY_OPTIONS,
  );
  const {
    data: tokenData,
    isFetched: isFetchedToken,
    hasNextPage: hasNextPageToken,
    fetchNextPage: fetchNextPageToken,
  } = useGetAccountTokenTransfers(
    { address, fromDate: tokenFilter.params.fromDate, toDate: tokenFilter.params.toDate },
    FILTERED_QUERY_OPTIONS,
  );

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const nativeTransfers = React.useMemo(() => nativeData?.pages.flatMap(page => page.items) ?? [], [nativeData]);
  const tokenTransfers = React.useMemo(() => tokenData?.pages.flatMap(page => page.items) ?? [], [tokenData]);

  const [currentTab, setCurrentTab] = useHistoryEntryState<string>(`account:${address}:tab`, ACTIVITY_TAB.TRANSACTIONS);

  const detailTabs = React.useMemo(
    () => [
      { tabName: ACCOUNT_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[1], size: nativeData?.pages[0]?.page.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[2], size: tokenData?.pages[0]?.page.totalCount },
    ],
    [directData, nativeData, tokenData],
  );

  if (!isFetchedDirect) {
    return <AccountTransactionsSkeleton />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <>
          <TransactionFilterBar
            value={directFilter.input}
            onChange={directFilter.setInput}
            functionNames={functionNameData?.items}
          />
          <ActivityDatatable
            variant="direct"
            data={directTransactions}
            isFetched={isFetchedDirect}
            hasNextPage={hasNextPageDirect}
            nextPage={fetchNextPageDirect}
            moreLabel="View More Transactions"
          />
        </>
      )}
      {currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <>
          <TransactionFilterBar value={nativeFilter.input} onChange={nativeFilter.setInput} dateOnly />
          <ActivityDatatable
            variant="transfers"
            data={nativeTransfers}
            isFetched={isFetchedNative}
            hasNextPage={hasNextPageNative}
            nextPage={fetchNextPageNative}
            moreLabel="View More Transfers"
          />
        </>
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <>
          <TransactionFilterBar value={tokenFilter.input} onChange={tokenFilter.setInput} dateOnly />
          <ActivityDatatable
            variant="transfers"
            data={tokenTransfers}
            isFetched={isFetchedToken}
            hasNextPage={hasNextPageToken}
            nextPage={fetchNextPageToken}
            moreLabel="View More Transfers"
          />
        </>
      )}
    </DataListSection>
  );
};

export default StandardNetworkAccountTransactions;
