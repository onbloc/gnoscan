"use client";

import React, { useMemo } from "react";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { ViewMoreButton } from "@/components/ui/button";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { ActivityRow } from "@/models/api/activity/activity-model";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { getRepresentativeTransactionFunction } from "@/common/utils/transaction-list.utility";

/**
 * Column set shared by every unified activity tab (one row per tx, no row expansion):
 * - "direct": Transactions tab (Tx Hash, Function, Block, Caller, Native Value, Fee, Time).
 * - "transfers": Native/Token Transfers on account & realm pages (Amount In/Out).
 * - "token-volume": Token page's own Token Transfers tab (Volume/Transfers count instead of In/Out).
 * - "internal": Internal Transactions tab (Entry Function, Realm Events summary).
 */
export type ActivityDatatableVariant = "direct" | "transfers" | "token-volume" | "internal";

interface Props {
  variant: ActivityDatatableVariant;
  data: ActivityRow[];
  isFetched: boolean;
  hasNextPage?: boolean;
  nextPage?: () => void;
  moreLabel: string;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

export const ActivityDatatable = ({ variant, data, isFetched, hasNextPage, nextPage, moreLabel }: Props) => {
  const { breakpoint } = useWindowSize();
  const { getTokenAmount } = useTokenMeta();

  const headers = useMemo(() => {
    const createHeaderTxHash = (width = 200) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("txHash")
        .name("Tx Hash")
        .width(width)
        .colorName("blue")
        .renderOption((value, row) => (
          <DatatableItem.TxHash txHash={value} status={row.successYn ? "success" : "failure"} />
        ))
        .build();

    const createHeaderFunction = (width = 180) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("func")
        .name(variant === "internal" ? "Entry Function" : "Function")
        .width(width)
        .colorName("blue")
        .tooltip(TOOLTIP_TYPE)
        .renderOption((_, row) => {
          const func = getRepresentativeTransactionFunction(row);
          return (
            <DatatableItem.Type
              type={func?.messageType ?? ""}
              func={func?.funcType ?? ""}
              packagePath={func?.pkgPath}
              msgNum={row.messageCount - 1}
            />
          );
        })
        .build();

    const createHeaderBlock = (width = 110) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("blockHeight")
        .name("Block")
        .width(width)
        .colorName("blue")
        .renderOption(height => <DatatableItem.Block height={height} />)
        .build();

    const createHeaderCaller = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("callerAddress")
        .name("Caller")
        .width(width)
        .colorName("blue")
        .renderOption((address, data) => (
          <DatatableItem.Account address={address} label={data.callerLabel} labelType={data.callerLabelType} />
        ))
        .build();

    const createHeaderAmountIn = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("amountsIn")
        .name("Amount (In)")
        .width(width)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderAmountOut = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("amountsOut")
        .name("Amount (Out)")
        .width(width)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderVolume = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("volume")
        .name("Volume")
        .width(width)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderTransferCount = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("transferCount")
        .name("Transfers")
        .width(width)
        .renderOption(count => <span>{count}</span>)
        .build();

    const createHeaderRealmEvents = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("realmEvents")
        .name("Realm Events")
        .width(width)
        .renderOption(events => <DatatableItem.RealmEventsSummary events={events} />)
        .build();

    const createHeaderTime = (width = 120) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("timestamp")
        .name("Time")
        .width(width)
        .className("time")
        .renderOption(date => <DatatableItem.Date date={date} />)
        .build();

    const createHeaderFee = (width = 130) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("fee")
        .name("Fee")
        .className("fee")
        .width(width)
        .renderOption(({ value, denom }: { value: string; denom: string }) => (
          <DatatableItem.Amount {...getTokenAmount(denom, value)} />
        ))
        .build();

    const createHeaderNativeValue = (width: number) =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("nativeValue")
        .name("Native Value")
        .width(width)
        .renderOption(amount => <DatatableItem.ActivityAmountStack amounts={amount ? [amount] : []} />)
        .build();
    // Shared columns keep one width across variants (Tx Hash 200, Block 110, Fee 130, Time 120);
    // the rest is split among variable-length columns so each variant sums to the 1146px table min-width.
    switch (variant) {
      case "direct":
        return [
          createHeaderTxHash(),
          createHeaderFunction(220),
          createHeaderBlock(),
          createHeaderCaller(170),
          createHeaderNativeValue(196),
          createHeaderFee(),
          createHeaderTime(),
        ];
      case "transfers":
        return [
          createHeaderTxHash(),
          createHeaderFunction(210),
          createHeaderBlock(),
          createHeaderAmountIn(188),
          createHeaderAmountOut(188),
          createHeaderFee(),
          createHeaderTime(),
        ];
      case "token-volume":
        return [
          createHeaderTxHash(),
          createHeaderFunction(210),
          createHeaderBlock(),
          createHeaderVolume(256),
          createHeaderTransferCount(120),
          createHeaderFee(),
          createHeaderTime(),
        ];
      case "internal":
        // One column fewer: spread the spare width across all columns instead of padding Realm Events.
        return [
          createHeaderTxHash(236),
          createHeaderFunction(256),
          createHeaderRealmEvents(220),
          createHeaderBlock(130),
          createHeaderFee(160),
          createHeaderTime(144),
        ];
      default:
        return [];
    }
  }, [variant, getTokenAmount]);

  return (
    <FlushTableContainer>
      <Datatable loading={!isFetched} headers={headers} datas={data} />
      {hasNextPage && nextPage && (
        <ViewMoreButton variant="table" breakpoint={breakpoint} text={moreLabel} onClick={() => nextPage()} />
      )}
    </FlushTableContainer>
  );
};
