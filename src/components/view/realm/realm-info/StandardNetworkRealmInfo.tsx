import React from "react";

import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { AccountMapper } from "@/common/mapper/account/account-mapper";
import {
  useGetRealmEventsByPath,
  useGetRealmInternalTransfersByPath,
  useGetRealmInternalNativeTransfersByPath,
  useGetRealmTransactionsByPath,
  useGetRealmTokenTransfersByPath,
} from "@/common/react-query/realm/api";

import DataListSection from "../../details-data-section/data-list-section";
import { DETAIL_TAB_NAME } from "../../details-data-section/detail-tab-name.constant";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { StandardNetworkAccountTxsDatatable } from "../../datatable/account-detail/StandardNetworkAccountTxsDatatable";
import { RealmDetailDatatable } from "../../datatable";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const {
    data: transactionData,
    isFetched: isFetchedTransactionData,
    hasNextPage: hasNextPageTransactionData,
    fetchNextPage: fetchNextPageTransactionData,
  } = useGetRealmTransactionsByPath({ path });
  const {
    data: internalTransferData,
    isFetched: isFetchedInternalTransferData,
    hasNextPage: hasNextPageInternalTransferData,
    fetchNextPage: fetchNextPageInternalTransferData,
  } = useGetRealmInternalTransfersByPath({ path });
  const {
    data: eventData,
    isFetched: isFetchedEventData,
    hasNextPage: hasNextPageEventData,
    fetchNextPage: fetchNextPageEventData,
  } = useGetRealmEventsByPath({ path });
  const {
    data: tokenTransferData,
    isFetched: isFetchedTokenTransferData,
    hasNextPage: hasNextPageTokenTransferData,
    fetchNextPage: fetchNextPageTokenTransferData,
  } = useGetRealmTokenTransfersByPath({ path });
  const {
    data: internalNativeTransferData,
    isFetched: isFetchedInternalNativeTransferData,
    hasNextPage: hasNextPageInternalNativeTransferData,
    fetchNextPage: fetchNextPageInternalNativeTransferData,
  } = useGetRealmInternalNativeTransfersByPath({ path });

  const realmTransactions = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    const allItems = transactionData.pages.flatMap(page => page.items);
    return RealmMapper.realmTransactionFromApiResponses(allItems);
  }, [transactionData?.pages]);

  const realmEvents = React.useMemo(() => {
    if (!eventData?.pages) return [];

    const allItems = eventData.pages.flatMap(page => page.items);
    return RealmMapper.realmEventFromApiResponses(allItems);
  }, [eventData?.pages]);

  const realmInternalTransfers = React.useMemo(() => {
    if (!internalTransferData?.pages) return [];

    const allItems = internalTransferData.pages.flatMap(page => page.items);
    return RealmMapper.realmTransactionFromApiResponses(allItems);
  }, [internalTransferData?.pages]);

  const realmTokenTransfers = React.useMemo(() => {
    if (!tokenTransferData?.pages) return [];

    return AccountMapper.accountTransactionFromApiResponses(tokenTransferData.pages.flatMap(page => page.items ?? []));
  }, [tokenTransferData?.pages]);

  const realmInternalNativeTransfers = React.useMemo(() => {
    if (!internalNativeTransferData?.pages) return [];

    return AccountMapper.accountTransactionFromApiResponses(
      internalNativeTransferData.pages.flatMap(page => page.items ?? []),
    );
  }, [internalNativeTransferData?.pages]);

  const transactionsCount = transactionData?.pages[0]?.page.totalCount;
  const internalTransfersCount = internalTransferData?.pages[0]?.page.totalCount;
  const eventsCount = eventData?.pages[0]?.page.totalCount;
  const tokenTransfersCount = tokenTransferData?.pages[0]?.page.totalCount;
  const internalNativeTransfersCount = internalNativeTransferData?.pages[0]?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: DETAIL_TAB_NAME.TRANSACTIONS,
        size: transactionsCount ?? realmTransactions.length,
      },
      {
        tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS,
        size: internalTransfersCount ?? realmInternalTransfers.length,
      },
      {
        tabName: DETAIL_TAB_NAME.TOKEN_TRANSFERS,
        size: tokenTransfersCount ?? realmTokenTransfers.length,
      },
      {
        tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE,
        size: internalNativeTransfersCount ?? realmInternalNativeTransfers.length,
      },
      {
        tabName: DETAIL_TAB_NAME.EVENTS,
        size: eventsCount ?? realmEvents.length,
      },
    ];
  }, [
    transactionsCount,
    internalTransfersCount,
    eventsCount,
    realmTransactions,
    realmInternalTransfers,
    realmEvents,
    tokenTransfersCount,
    realmTokenTransfers,
    internalNativeTransfersCount,
    realmInternalNativeTransfers,
  ]);

  if (!isFetchedTransactionData) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <RealmDetailDatatable
          data={realmTransactions}
          isFetched={isFetchedTransactionData}
          hasNextPage={hasNextPageTransactionData || false}
          nextPage={fetchNextPageTransactionData}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS && (
        <RealmDetailDatatable
          data={realmInternalTransfers}
          isFetched={isFetchedInternalTransferData}
          hasNextPage={hasNextPageInternalTransferData || false}
          nextPage={fetchNextPageInternalTransferData}
          pkgPath={`${path}`}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.TOKEN_TRANSFERS && (
        <StandardNetworkAccountTxsDatatable
          address={path}
          data={realmTokenTransfers}
          isFetched={isFetchedTokenTransferData}
          hasNextPage={hasNextPageTokenTransferData}
          nextPage={fetchNextPageTokenTransferData}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE && (
        <StandardNetworkAccountTxsDatatable
          address={path}
          data={realmInternalNativeTransfers}
          isFetched={isFetchedInternalNativeTransferData}
          hasNextPage={hasNextPageInternalNativeTransferData}
          nextPage={fetchNextPageInternalNativeTransferData}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.EVENTS && (
        <StandardNetworkEventDatatable
          isFetched={isFetchedEventData}
          events={realmEvents}
          hasNextPage={hasNextPageEventData}
          nextPage={fetchNextPageEventData}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkRealmInfo;
