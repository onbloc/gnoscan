"use client";
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { mapDisplayFunctionName } from "@/common/utils/format/format-utils";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";

import { TooltipContainer } from "../TransactionListTable.styles";
import { CardTableContainer } from "@/components/view/datatable/datatable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "@/components/view/datatable";
import { ViewMoreButton } from "@/components/ui/button";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { TransactionModel } from "@/models/api/transaction/transaction-model";
import { getRepresentativeTransactionFunction } from "@/common/utils/transaction-list.utility";

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

interface StandardNetworkTransactionListTableProps {
  transactions: TransactionModel[];
  hasNextPage?: boolean;
  isFetched: boolean;
  isLoading: boolean;
  nextPage: () => void;
}

export const StandardNetworkTransactionListTable = ({
  transactions,
  hasNextPage,
  nextPage,
  isFetched,
  isLoading,
}: StandardNetworkTransactionListTableProps) => {
  const createHeaders = () => {
    return [
      createHeaderTxHash(),
      createHeaderType(),
      createHeaderBlock(),
      createHeaderFrom(),
      createHeaderAmount(),
      createHeaderTime(),
      createHeaderFee(),
    ];
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("txHash")
      .name("Tx Hash")
      .width(215)
      .colorName("blue")
      .renderOption((value, data) => {
        if (!data) return null;
        return <DatatableItem.TxHash txHash={value || ""} status={data.successYn ? "success" : "failure"} />;
      })
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("type")
      .name("Function")
      .width(190)
      .colorName("blue")
      .tooltip(<TooltipContainer>{TOOLTIP_TYPE}</TooltipContainer>)
      .renderOption((_, data) => {
        const func = getRepresentativeTransactionFunction(data);
        if (!func) return "-";

        const displayFunctionName = mapDisplayFunctionName(func.pkgPath, func.funcType);

        return (
          <DatatableItem.Type
            type={func.messageType}
            func={displayFunctionName}
            packagePath={func.pkgPath}
            msgNum={data.messageCount - 1}
          />
        );
      })
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("blockHeight")
      .name("Block")
      .width(113)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("from")
      .name("From")
      .width(170)
      .colorName("blue")
      .renderOption((_, data) => {
        if (!data) return null;
        return (
          <DatatableItem.Publisher
            address={data?.fromAddress || ""}
            username={data?.fromName || ""}
            label={data?.fromLabel}
            labelType={data?.fromLabelType}
          />
        );
      })
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("amount")
      .name("Amount")
      .width(190)
      .renderOption((_, data) => {
        if (!data) return null;
        return data.messageCount > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data?.txHash || ""}`} />
        ) : (
          <DatatableItem.StandardNetworkAmount data={data?.amount || {}} />
        );
      })
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("timestamp")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => {
        if (!date) return null;
        return <DatatableItem.Date date={date} />;
      })
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("fee")
      .name("Fee")
      .width(113)
      .className("fee")
      .renderOption(fee => {
        if (!fee || !fee?.value || !fee?.denom) return "-";
        return <DatatableItem.Amount {...toGNOTAmount(fee.value, fee.denom)} />;
      })
      .build();
  };

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <CardTableContainer>
      <Datatable headers={createHeaders()} datas={transactions} />
      {hasNextPage && (
        <div className="button-wrapper">
          <ViewMoreButton variant="table" text="View More Transactions" onClick={() => nextPage()} />
        </div>
      )}
    </CardTableContainer>
  );
};
