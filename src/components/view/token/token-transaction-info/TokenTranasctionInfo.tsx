import React from "react";

import DataSection from "../../details-data-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenDetailDatatablePage } from "../../datatable/token-detail/token-detail-page";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork }: TokenTransactionInfoProps) => {
  return (
    <DataSection title="Transactions">
      {tokenPath && isCustomNetwork && <TokenDetailDatatable path={tokenPath} />}
      {tokenPath && !isCustomNetwork && <TokenDetailDatatablePage path={tokenPath} />}
    </DataSection>
  );
};

export default TokenTransactionInfo;
