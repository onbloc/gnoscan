import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { AccountDetailDatatable } from "../../datatable";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useAccount } from "@/common/hooks/account/use-account";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";
import { PlaceholderDatatable } from "../../datatable/placeholder";
import { DETAIL_TAB_NAME } from "../../details-data-section/detail-tab-name.constant";

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

  const [currentTab, setCurrentTab] = React.useState<string>(DETAIL_TAB_NAME.TRANSACTIONS);

  const detailTabs = React.useMemo(() => {
    return [
      { tabName: DETAIL_TAB_NAME.TRANSACTIONS, size: accountTransactions?.length },
      { tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS },
      { tabName: DETAIL_TAB_NAME.TOKEN_TRANSFERS },
      { tabName: DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE },
    ];
  }, [accountTransactions]);

  if (isLoadingTransactions || !isFetchedAccountTransactions) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === DETAIL_TAB_NAME.TRANSACTIONS && (
        <AccountDetailDatatable
          data={accountTransactions || []}
          address={address}
          isFetched={isFetchedAccountTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
        />
      )}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS && <PlaceholderDatatable />}
      {currentTab === DETAIL_TAB_NAME.TOKEN_TRANSFERS && <PlaceholderDatatable />}
      {currentTab === DETAIL_TAB_NAME.INTERNAL_TRANSFERS_NATIVE && <PlaceholderDatatable />}
    </DataListSection>
  );
};

export default CustomNetworkAccountTransactions;
