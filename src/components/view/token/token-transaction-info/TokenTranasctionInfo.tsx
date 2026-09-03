import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenDetailDatatablePage } from "../../datatable/token-detail/token-detail-page";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";
import { useGetTokenHoldersByid, useGetTokenTransactionsByid } from "@/common/react-query/token/api";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, currentTab, setCurrentTab }: TokenTransactionInfoProps) => {
  const { data: transactionsData } = useGetTokenTransactionsByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  const { data: holdersData } = useGetTokenHoldersByid(
    { path: tokenPath },
    { enabled: !isCustomNetwork && !!tokenPath },
  );

  const transactionsCount = transactionsData?.pages[0]?.page.totalCount;
  const holdersCount = holdersData?.pages[0]?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: "Transactions", size: transactionsCount }];
    }

    return [
      { tabName: "Transactions", size: transactionsCount },
      { tabName: "Holders", size: holdersCount },
    ];
  }, [isCustomNetwork, transactionsCount, holdersCount]);

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {tokenPath && isCustomNetwork && currentTab === "Transactions" && <TokenDetailDatatable path={tokenPath} />}
      {tokenPath && !isCustomNetwork && currentTab === "Transactions" && <TokenDetailDatatablePage path={tokenPath} />}
      {tokenPath && !isCustomNetwork && currentTab === "Holders" && <TokenHoldersDatatablePage path={tokenPath} />}
    </DataListSection>
  );
};

export default TokenTransactionInfo;
