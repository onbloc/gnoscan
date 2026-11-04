import React from "react";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import DataListSection from "../../details-data-section/data-list-section";
import AccountTransactionsSkeleton from "./AccountTransactionsSkeleton";
import { ListPagination } from "../../common/list-pagination/ListPagination";
import { ActivityDatatable } from "../../datatable/activity";
import { useGetAccountDirectTransactions } from "@/common/react-query/account/api/use-get-account-direct-transactions";
import { useGetAccountNativeTransfers } from "@/common/react-query/account/api/use-get-account-native-transfers";
import { useGetAccountTokenTransfers } from "@/common/react-query/account/api/use-get-account-token-transfers";
import { ACCOUNT_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

interface AccountTransactionsProps {
  address: string;
}

const StandardNetworkAccountTransactions = ({ address }: AccountTransactionsProps) => {
  const direct = usePagedList("account-direct", address, useGetAccountDirectTransactions, { address });
  const native = usePagedList("account-native", address, useGetAccountNativeTransfers, { address });
  const token = usePagedList("account-token", address, useGetAccountTokenTransfers, { address });

  const [currentTab, setCurrentTab] = useHistoryEntryState<string>(`account:${address}:tab`, ACTIVITY_TAB.TRANSACTIONS);

  const detailTabs = React.useMemo(
    () => [
      { tabName: ACCOUNT_DETAIL_TABS[0], size: direct.pagination.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[1], size: native.pagination.totalCount },
      { tabName: ACCOUNT_DETAIL_TABS[2], size: token.pagination.totalCount },
    ],
    [direct.pagination.totalCount, native.pagination.totalCount, token.pagination.totalCount],
  );

  if (!direct.isFetched) {
    return <AccountTransactionsSkeleton />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={direct.items}
          isFetched={direct.isFetched}
          footer={<ListPagination {...direct.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={native.items}
          isFetched={native.isFetched}
          footer={<ListPagination {...native.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={token.items}
          isFetched={token.isFetched}
          footer={<ListPagination {...token.pagination} />}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkAccountTransactions;
