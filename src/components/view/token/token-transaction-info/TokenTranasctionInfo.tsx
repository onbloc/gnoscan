import React from "react";

import DataListSection from "../../details-data-section/data-list-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenDetailDatatablePage } from "../../datatable/token-detail/token-detail-page";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, currentTab, setCurrentTab }: TokenTransactionInfoProps) => {
  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: "Transactions" }];
    }

    return [{ tabName: "Transactions" }, { tabName: "Holders" }];
  }, [isCustomNetwork]);

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {tokenPath && isCustomNetwork && currentTab === "Transactions" && <TokenDetailDatatable path={tokenPath} />}
      {tokenPath && !isCustomNetwork && currentTab === "Transactions" && <TokenDetailDatatablePage path={tokenPath} />}
      {tokenPath && !isCustomNetwork && currentTab === "Holders" && <TokenHoldersDatatablePage path={tokenPath} />}
    </DataListSection>
  );
};

export default TokenTransactionInfo;
