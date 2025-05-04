import React from "react";

import { GnoEvent } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { AccountDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useGetAccountTransactions } from "@/common/react-query/account/api/use-get-account-transactions";
import { useGetAccountEvents } from "@/common/react-query/account/api/use-get-account-events";

interface AccountTransactionsProps {
  address: string;
  transactionEvents: GnoEvent[];
  isDesktop: boolean;
  isFetched: boolean;
  isLoading: boolean;
}

const StandardNetworkAccountTransactions = ({
  address,
  transactionEvents,
  isDesktop,
  isFetched,
  isLoading,
}: AccountTransactionsProps) => {
  const { data: transactionData } = useGetAccountTransactions({ address });
  const { data: eventData } = useGetAccountEvents({ address });

  const accountTransactions = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    return transactionData.pages.flatMap(page => page.items);
  }, [transactionData]);

  const accountEvents: GnoEvent[] = React.useMemo(() => {
    if (!eventData?.pages) return [];

    const allItems = eventData.pages.flatMap(page => page.items);
    return allItems.map((item): GnoEvent => {
      return {
        id: item.identifier,
        blockHeight: item.blockHeight,
        transactionHash: item.txHash,
        caller: item.caller,
        type: "",
        packagePath: "",
        functionName: item.function,
        time: item.timestamp,
        attrs: [],
      };
    });
  }, [eventData]);

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

export default StandardNetworkAccountTransactions;
