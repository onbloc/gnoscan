import React from "react";

import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useNetwork } from "@/common/hooks/use-network";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useUsername } from "@/common/hooks/account/use-username";

import TransactionInfo from "@/components/view/transaction/transaction-info/TransactionInfo";

interface TransactionInfoContainerProps {
  txHash: string;
}

const TransactionInfoContainer = ({ txHash }: TransactionInfoContainerProps) => {
  const { isDesktop } = useWindowSize();

  const [currentTab, setCurrentTab] = React.useState("Contract");

  const { transactionEvents, transactionItem, isFetched } = useTransaction(txHash);
  const { getUrlWithNetwork } = useNetwork();
  const { getTokenAmount } = useTokenMeta();
  const { getName } = useUsername();

  return (
    <TransactionInfo
      transactionEvents={transactionEvents}
      transactionItem={transactionItem}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      isDesktop={isDesktop}
      isFetched={isFetched}
      getUrlWithNetwork={getUrlWithNetwork}
      getTokenAmount={getTokenAmount}
      getName={getName}
    />
  );
};

export default TransactionInfoContainer;
