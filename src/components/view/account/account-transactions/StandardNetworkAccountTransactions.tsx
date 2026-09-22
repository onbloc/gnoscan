import React from "react";

import { Transaction } from "@/types/data-type";
import { AccountMapper } from "@/common/mapper/account/account-mapper";

import DataListSection from "../../details-data-section/data-list-section";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useGetAccountTransactions } from "@/common/react-query/account/api/use-get-account-transactions";
import { useGetAccountTokenTransfers } from "@/common/react-query/account/api/use-get-account-token-transfers";
import { StandardNetworkAccountTxsDatatable } from "../../datatable/account-detail/StandardNetworkAccountTxsDatatable";
import { PlaceholderDatatable } from "../../datatable/placeholder";
import { DETAIL_TAB_NAME } from "../../details-data-section/detail-tab-name.constant";

interface AccountTransactionsProps {
  address: string;
  isDesktop: boolean;
}

const StandardNetworkAccountTransactions = ({ address, isDesktop }: AccountTransactionsProps) => {
  const {
    data: transactionData,
    isFetched: isFetchedTransactionData,
    hasNextPage,
    fetchNextPage,
  } = useGetAccountTransactions({ address });
  const {
    data: tokenTransferData,
    isFetched: isFetchedTokenTransferData,
    hasNextPage: tokenTransferHasNextPage,
    fetchNextPage: tokenTransferFetchNextPage,
  } = useGetAccountTokenTransfers({ address });

  const accountTransactions: Transaction[] = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    return AccountMapper.accountTransactionFromApiResponses(transactionData.pages.flatMap(page => page.items ?? []));
  }, [transactionData]);

  const accountTokenTransfers: Transaction[] = React.useMemo(() => {
    if (!tokenTransferData?.pages) return [];

    return AccountMapper.accountTransactionFromApiResponses(tokenTransferData.pages.flatMap(page => page.items ?? []));
  }, [tokenTransferData]);

  const [currentTab, setCurrentTab] = React.useState<string>(DETAIL_TAB_NAME.TRANSACTIONS);

  const transactionsCount = transactionData?.pages[0]?.page.totalCount;
  const tokenTransfersCount = tokenTransferData?.pages[0]?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: DETAIL_TAB_NAME.TRANSACTIONS,
        size: transactionsCount ?? accountTransactions.length,
      },
      { tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS },
      {
        tabName: DETAIL_TAB_NAME.TOKEN_TRANSFERS,
        size: tokenTransfersCount ?? accountTokenTransfers.length,
      },
      { tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE },
    ];
  }, [transactionsCount, accountTransactions, tokenTransfersCount, accountTokenTransfers]);

  if (!isFetchedTransactionData) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <StandardNetworkAccountTxsDatatable
          address={address}
          data={accountTransactions}
          isFetched={isFetchedTransactionData}
          hasNextPage={hasNextPage}
          nextPage={fetchNextPage}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS && <PlaceholderDatatable />}
      {currentTab === DETAIL_TAB_NAME.TOKEN_TRANSFERS && (
        <StandardNetworkAccountTxsDatatable
          address={address}
          data={accountTokenTransfers}
          isFetched={isFetchedTokenTransferData}
          hasNextPage={tokenTransferHasNextPage}
          nextPage={tokenTransferFetchNextPage}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE && <PlaceholderDatatable />}
    </DataListSection>
  );
};

export default StandardNetworkAccountTransactions;
