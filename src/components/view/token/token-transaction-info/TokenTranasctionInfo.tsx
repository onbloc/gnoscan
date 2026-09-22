import React from "react";

import { AccountMapper } from "@/common/mapper/account/account-mapper";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import {
  useGetRealmInternalNativeTransfersByPath,
  useGetRealmTransactionsByPath,
} from "@/common/react-query/realm/api";
import DataListSection from "../../details-data-section/data-list-section";
import { RealmDetailDatatable, TokenDetailDatatable } from "../../datatable";
import { StandardNetworkAccountTxsDatatable } from "../../datatable/account-detail/StandardNetworkAccountTxsDatatable";
import { TokenDetailDatatablePage } from "../../datatable/token-detail/token-detail-page";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";
import {
  useGetTokenById,
  useGetTokenHoldersByid,
  useGetTokenInternalTransfersByid,
  useGetTokenTransactionsByid,
} from "@/common/react-query/token/api";
import { DETAIL_TAB_NAME } from "../../details-data-section/detail-tab-name.constant";

const TOKEN_HOLDERS_TAB_NAME = "Holders";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, currentTab, setCurrentTab }: TokenTransactionInfoProps) => {
  const { data: tokenData } = useGetTokenById(tokenPath, { enabled: !isCustomNetwork && !!tokenPath });
  const tokenRealmPath = tokenData?.data.path;

  const {
    data: transactionsData,
    isFetched: isFetchedTransactions,
    hasNextPage: hasNextPageTransactions,
    fetchNextPage: fetchNextPageTransactions,
  } = useGetRealmTransactionsByPath({ path: tokenRealmPath || "" }, { enabled: !isCustomNetwork && !!tokenRealmPath });
  const { data: tokenTransferData } = useGetTokenTransactionsByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  const { data: holdersData } = useGetTokenHoldersByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  const { data: internalTransfersData } = useGetTokenInternalTransfersByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  const {
    data: internalNativeTransferData,
    isFetched: isFetchedInternalNativeTransferData,
    hasNextPage: hasNextPageInternalNativeTransferData,
    fetchNextPage: fetchNextPageInternalNativeTransferData,
  } = useGetRealmInternalNativeTransfersByPath(
    { path: tokenRealmPath || "" },
    { enabled: !isCustomNetwork && !!tokenRealmPath },
  );

  const tokenTransactions = React.useMemo(() => {
    if (!transactionsData?.pages) return [];

    return RealmMapper.realmTransactionFromApiResponses(transactionsData.pages.flatMap(page => page.items));
  }, [transactionsData?.pages]);

  const tokenInternalNativeTransfers = React.useMemo(() => {
    if (!internalNativeTransferData?.pages) return [];

    return AccountMapper.accountTransactionFromApiResponses(
      internalNativeTransferData.pages.flatMap(page => page.items ?? []),
    );
  }, [internalNativeTransferData?.pages]);

  const transactionsCount = transactionsData?.pages[0]?.page.totalCount;
  const tokenTransfersCount = tokenTransferData?.pages[0]?.page.totalCount;
  const internalTransfersCount = internalTransfersData?.pages[0]?.page.totalCount;
  const internalNativeTransfersCount = internalNativeTransferData?.pages[0]?.page.totalCount;
  const holdersCount = holdersData?.pages[0]?.page.totalCount;
  const tokenTransfersLength = tokenTransferData?.pages.flatMap(page => page.items ?? []).length ?? 0;
  const internalTransfersLength = internalTransfersData?.pages.flatMap(page => page.items ?? []).length ?? 0;

  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: DETAIL_TAB_NAME.TRANSACTIONS, size: transactionsCount ?? 0 }];
    }

    return [
      { tabName: DETAIL_TAB_NAME.TRANSACTIONS, size: transactionsCount ?? tokenTransactions.length },
      { tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS, size: internalTransfersCount ?? internalTransfersLength },
      { tabName: DETAIL_TAB_NAME.TOKEN_TRANSFERS, size: tokenTransfersCount ?? tokenTransfersLength },
      {
        tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE,
        size: internalNativeTransfersCount ?? tokenInternalNativeTransfers.length,
      },
      { tabName: TOKEN_HOLDERS_TAB_NAME, size: holdersCount ?? 0 },
    ];
  }, [
    isCustomNetwork,
    transactionsCount,
    tokenTransactions,
    internalTransfersCount,
    internalTransfersLength,
    tokenTransfersCount,
    tokenTransfersLength,
    internalNativeTransfersCount,
    tokenInternalNativeTransfers,
    holdersCount,
  ]);

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {tokenPath && isCustomNetwork && currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <TokenDetailDatatable path={tokenPath} />
      )}
      {tokenPath && !isCustomNetwork && currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <RealmDetailDatatable
          data={tokenTransactions}
          isFetched={isFetchedTransactions}
          hasNextPage={hasNextPageTransactions || false}
          nextPage={fetchNextPageTransactions}
          pkgPath={tokenRealmPath || tokenPath}
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS && (
        <TokenDetailDatatablePage path={tokenPath} type="internalTransfers" />
      )}
      {tokenPath && !isCustomNetwork && currentTab === DETAIL_TAB_NAME.TOKEN_TRANSFERS && (
        <TokenDetailDatatablePage path={tokenPath} />
      )}
      {tokenPath && !isCustomNetwork && currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE && (
        <StandardNetworkAccountTxsDatatable
          address={tokenRealmPath || tokenPath}
          data={tokenInternalNativeTransfers}
          isFetched={isFetchedInternalNativeTransferData}
          hasNextPage={hasNextPageInternalNativeTransferData}
          nextPage={fetchNextPageInternalNativeTransferData}
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === TOKEN_HOLDERS_TAB_NAME && (
        <TokenHoldersDatatablePage path={tokenPath} />
      )}
    </DataListSection>
  );
};

export default TokenTransactionInfo;
