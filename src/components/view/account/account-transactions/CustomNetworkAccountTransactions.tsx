import React from "react";

import { GnoEvent } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { AccountDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useAccount } from "@/common/hooks/account/use-account";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";

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

  const {
    isFetchedAccountTransactions,
    isLoadingTransactions,
    transactionEvents,
    accountTransactions,
    hasNextPage,
    nextPage,
  } = useAccount(bech32Address || "");

  const [currentTab, setCurrentTab] = React.useState("Transactions");

  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  if (isLoadingTransactions || !isFetchedAccountTransactions) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <AccountDetailDatatable
          data={accountTransactions || []}
          address={address}
          isFetched={isFetchedAccountTransactions}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
        />
      )}
      {currentTab === "Events" && (
        <EventDatatable events={transactionEvents} isFetched={isFetchedAccountTransactions} />
      )}
    </DataListSection>
  );
};

export default CustomNetworkAccountTransactions;
