import React, { useMemo } from "react";
import BigNumber from "bignumber.js";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { getRepresentativeTransactionFunction } from "@/common/utils/transaction-list.utility";
import { AccountNativeBalanceChange } from "@/repositories/api/account/response";
import { DatatableItem } from "..";
import { TOOLTIP_TYPE } from "../activity";
import { FlushTableContainer } from "../datatable.styles";
import { splitChange } from "./balance-change.utility";

interface Props {
  data: AccountNativeBalanceChange[];
  isFetched: boolean;
  footer?: React.ReactNode;
}

/** The transactions that changed the native balance, in the columns of the Native Transfers tab. */
export const AccountBalanceChangeDatatable = ({ data, isFetched, footer }: Props) => {
  const { getTokenAmount } = useTokenMeta();

  const headers = useMemo(() => {
    // Zero shows as a dash, like the amounts of the activity tables.
    const renderAmount = (ugnot: string) =>
      new BigNumber(ugnot).isZero() ? (
        <span>-</span>
      ) : (
        <DatatableItem.Amount {...getTokenAmount(GNOTToken.denom, ugnot)} />
      );

    return [
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("txHash")
        .name("Tx Hash")
        .width(200)
        .colorName("blue")
        .renderOption((value, row) => (
          <DatatableItem.TxHash txHash={value} status={row.successYn ? "success" : "failure"} />
        ))
        .build(),
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("func")
        .name("Function")
        .width(210)
        .colorName("blue")
        .tooltip(TOOLTIP_TYPE)
        .renderOption((_, row) => {
          // A server that lacks the messages (an older one) leaves the chip empty instead of failing the page.
          const messageCount = row.messageCount ?? 0;
          const func = getRepresentativeTransactionFunction({ messageCount, func: row.func ?? [] });
          return (
            <DatatableItem.Type
              messageType={func?.messageType ?? ""}
              functionName={func?.funcType ?? ""}
              packagePath={func?.pkgPath}
              messageCount={messageCount}
              txHash={row.txHash}
            />
          );
        })
        .build(),
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("blockHeight")
        .name("Block")
        .width(110)
        .colorName("blue")
        .renderOption(height => <DatatableItem.Block height={height} />)
        .build(),
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("amount")
        .name("Amount (In)")
        .width(253)
        .renderOption(amount => renderAmount(splitChange(amount).in))
        .build(),
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("amount")
        .name("Amount (Out)")
        .width(253)
        .renderOption(amount => renderAmount(splitChange(amount).out))
        .build(),
      DatatableOption.Builder.builder<AccountNativeBalanceChange>()
        .key("timestamp")
        .name("Time")
        .width(120)
        .className("time")
        .renderOption(date => <DatatableItem.Date date={date} />)
        .build(),
    ];
  }, [getTokenAmount]);

  return (
    <FlushTableContainer>
      <Datatable loading={!isFetched} headers={headers} datas={data} />
      {footer}
    </FlushTableContainer>
  );
};
