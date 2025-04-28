import React from "react";

import DataSection from "../../details-data-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenDetailDatatablePage } from "../../datatable/token-detail/token-detail-page";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  isFetched: boolean;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, isFetched }: TokenTransactionInfoProps) => {
  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Transactions">
      {tokenPath && isCustomNetwork && <TokenDetailDatatable path={tokenPath} />}
      {tokenPath && !isCustomNetwork && <TokenDetailDatatablePage path={tokenPath} />}
    </DataSection>
  );
};

export default TokenTransactionInfo;
