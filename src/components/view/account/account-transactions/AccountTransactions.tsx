import React from "react";

import { GnoEvent } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { AccountDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";

interface AccountTransactionsProps {
  address: string;
  transactionEvents: GnoEvent[];
  isDesktop: boolean;
  isFetched: boolean;
  isLoading: boolean;
}

const AccountTransactions = ({
  address,
  transactionEvents,
  isDesktop,
  isFetched,
  isLoading,
}: AccountTransactionsProps) => {
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

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && <AccountDetailDatatable address={address} />}
      {currentTab === "Events" && <EventDatatable events={transactionEvents} isFetched={isFetched} />}
    </DataListSection>
  );
};

export default AccountTransactions;
