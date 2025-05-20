import React from "react";

import { GnoEvent, Transaction } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import AccountAddressSkeleton from "../account-address/AccountAddressSkeleton";
import { useGetAccountTransactions } from "@/common/react-query/account/api/use-get-account-transactions";
import { useGetAccountEvents } from "@/common/react-query/account/api/use-get-account-events";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { StandardNetworkAccountTxsDatatable } from "../../datatable/account-detail/StandardNetworkAccountTxsDatatable";

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
    data: eventData,
    isFetched: isFetchedEventData,
    hasNextPage: eventHasNextPage,
    fetchNextPage: eventFetchNextPage,
  } = useGetAccountEvents({ address });

  const accountTransactions: Transaction[] = React.useMemo(() => {
    if (!transactionData?.pages) return [];

    const allItems = transactionData.pages.flatMap(page => page.items ?? []);
    return allItems.map((item): Transaction => {
      return {
        amount: item.amountIn,
        amountOut: item.amountOut,
        blockHeight: item.blockHeight,
        fee: item.fee,
        from: "",
        to: "",
        hash: item.txHash,
        numOfMessage: item.func.length,
        functionName: item.func[0].funcType,
        packagePath: item.func[0].pkgPath,
        type: item.func[0].messageType,
        success: item.successYn,
        time: item.timestamp,
      };
    });
  }, [transactionData]);

  const accountEvents: GnoEvent[] = React.useMemo(() => {
    if (!eventData?.pages) return [];

    const allItems = eventData.pages.flatMap(page => page.items ?? []);
    return allItems.map((item): GnoEvent => {
      return {
        id: item.identifier,
        blockHeight: item.blockHeight,
        transactionHash: item.txHash,
        caller: item.caller,
        type: item.eventName,
        packagePath: item.realmPath,
        functionName: item.function,
        time: item.timestamp,
        attrs: item.emit.params,
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
        size: accountEvents.length,
      },
    ];
  }, [accountEvents]);

  if (!isFetchedTransactionData) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <StandardNetworkAccountTxsDatatable
          address={address}
          data={accountTransactions}
          isFetched={isFetchedTransactionData}
          hasNextPage={hasNextPage}
          nextPage={fetchNextPage}
        />
      )}
      {currentTab === "Events" && (
        <StandardNetworkEventDatatable
          events={accountEvents}
          isFetched={isFetchedEventData}
          hasNextPage={eventHasNextPage}
          nextPage={eventFetchNextPage}
        />
      )}
    </DataListSection>
  );
};

export default StandardNetworkAccountTransactions;
