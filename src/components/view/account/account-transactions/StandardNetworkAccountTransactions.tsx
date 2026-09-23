import React from "react";

import { useDetailTabScroll } from "@/common/hooks/detail-tabs/use-detail-tab-scroll";
import DataListSection from "../../details-data-section/data-list-section";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { ActivityDatatable } from "../../datatable/activity";
import { useGetAccountDirectTransactions } from "@/common/react-query/account/api/use-get-account-direct-transactions";
import { useGetAccountNativeTransfers } from "@/common/react-query/account/api/use-get-account-native-transfers";
import { useGetAccountTokenTransfers } from "@/common/react-query/account/api/use-get-account-token-transfers";
import { ACCOUNT_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

interface AccountTransactionsProps {
  address: string;
  isDesktop: boolean;
}

const StandardNetworkAccountTransactions = ({ address, isDesktop }: AccountTransactionsProps) => {
  const {
    data: directData,
    isFetched: isFetchedDirect,
    hasNextPage: hasNextPageDirect,
    fetchNextPage: fetchNextPageDirect,
  } = useGetAccountDirectTransactions({ address });
  const {
    data: nativeData,
    isFetched: isFetchedNative,
    hasNextPage: hasNextPageNative,
    fetchNextPage: fetchNextPageNative,
  } = useGetAccountNativeTransfers({ address });
  const {
    data: tokenData,
    isFetched: isFetchedToken,
    hasNextPage: hasNextPageToken,
    fetchNextPage: fetchNextPageToken,
  } = useGetAccountTokenTransfers({ address });

  const directTransactions = React.useMemo(() => directData?.pages.flatMap(page => page.items) ?? [], [directData]);
  const nativeTransfers = React.useMemo(() => nativeData?.pages.flatMap(page => page.items) ?? [], [nativeData]);
  const tokenTransfers = React.useMemo(() => tokenData?.pages.flatMap(page => page.items) ?? [], [tokenData]);

  const [currentTab, setCurrentTab] = useDetailTabScroll<string>(address, ACTIVITY_TAB.TRANSACTIONS);

  const detailTabs = React.useMemo(
    () => [
      { tabName: ACCOUNT_DETAIL_TABS[0], size: directData?.pages[0]?.page.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[1], size: nativeData?.pages[0]?.page.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[2], size: tokenData?.pages[0]?.page.totalCount },
    ],
    [directData, nativeData, tokenData],
  );

  if (!isFetchedDirect) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={directTransactions}
          isFetched={isFetchedDirect}
          hasNextPage={hasNextPageDirect}
          nextPage={fetchNextPageDirect}
          moreLabel="View More Transactions"
        />
      )}
      {currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={nativeTransfers}
          isFetched={isFetchedNative}
          hasNextPage={hasNextPageNative}
          nextPage={fetchNextPageNative}
          moreLabel="View More Transfers"
        />
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={tokenTransfers}
          isFetched={isFetchedToken}
          hasNextPage={hasNextPageToken}
          nextPage={fetchNextPageToken}
          moreLabel="View More Transfers"
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkAccountTransactions;
