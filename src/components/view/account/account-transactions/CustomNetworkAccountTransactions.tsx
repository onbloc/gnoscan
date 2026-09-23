import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { AccountDetailDatatable } from "../../datatable";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useAccount } from "@/common/hooks/account/use-account";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { ACCOUNT_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

interface AccountTransactionsProps {
  address: string;
  isDesktop: boolean;
}

const CustomNetworkAccountTransactions = ({ address, isDesktop }: AccountTransactionsProps) => {
  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getAddress } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const { isFetchedAccountTransactions, isLoadingTransactions, accountTransactions, hasNextPage, nextPage } =
    useAccount(bech32Address || "");

  const [currentTab, setCurrentTab] = React.useState<string>(ACTIVITY_TAB.TRANSACTIONS);

  // Custom RPC only supports scanning direct transactions - Native/Token Transfers would require
  // an indexer this network doesn't have, so those tabs aren't invented; only the one Custom RPC
  // can genuinely answer is shown (matches ACCOUNT_DETAIL_TABS[0]).
  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: ACCOUNT_DETAIL_TABS[0],
        size: accountTransactions?.length,
      },
    ];
  }, [accountTransactions]);

  if (isLoadingTransactions || !isFetchedAccountTransactions) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <AccountDetailDatatable
          data={accountTransactions || []}
          address={address}
          isFetched={isFetchedAccountTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
        />
      )}
    </DataListSection>
  );
};

export default CustomNetworkAccountTransactions;
