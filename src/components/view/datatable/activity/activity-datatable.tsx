"use client";

import React, { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import theme from "@/styles/theme";
import { themeState } from "@/states";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { ActivityRow } from "@/models/api/activity/activity-model";
import { DatatableItem } from "..";
import { ActivityMessagesDetail } from "./activity-messages-detail";
import { ActivityTransfersDetail } from "./activity-transfers-detail";
import { ActivityRealmEventsDetail } from "./activity-realm-events-detail";
import { getRepresentativeTransactionFunction } from "@/common/utils/transaction-list.utility";

/**
 * Column/expansion set shared by every unified activity tab:
 * - "direct": Transactions tab (Tx Hash, Function, Block, Caller, Native Value, Fee, Time; expands messages).
 * - "transfers": Native/Token Transfers on account & realm pages (Amount In/Out; expands transfers).
 * - "token-volume": Token page's own Token Transfers tab (Volume/Transfers count instead of In/Out; expands transfers).
 * - "internal": Internal Transactions tab (Entry Function, Realm Events summary; expands realm events).
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
  const themeMode = useRecoilValue(themeState);
  const { breakpoint } = useWindowSize();
  const { getTokenAmount } = useTokenMeta();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const headers = useMemo(() => {
    const toggleRow = (txHash: string) => {
      setExpandedRows(prev => (prev.includes(txHash) ? prev.filter(hash => hash !== txHash) : [...prev, txHash]));
    };

    const createHeaderTxHash = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("txHash")
        .name("Tx Hash")
        .width(200)
        .colorName("blue")
        .renderOption((value, row) => (
          <DatatableItem.TxHash txHash={value} status={row.successYn ? "success" : "failure"} />
        ))
        .build();

    const createHeaderFunction = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("func")
        .name(variant === "internal" ? "Entry Function" : "Function")
        .width(190)
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

    const createHeaderBlock = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("blockHeight")
        .name("Block")
        .width(113)
        .colorName("blue")
        .renderOption(height => <DatatableItem.Block height={height} />)
        .build();

    const createHeaderCaller = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("callerAddress")
        .name("Caller")
        .width(170)
        .colorName("blue")
        .renderOption(address => <DatatableItem.Account address={address} />)
        .build();

    const createHeaderAmountIn = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("amountsIn")
        .name("Amount (In)")
        .width(190)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderAmountOut = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("amountsOut")
        .name("Amount (Out)")
        .width(190)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderVolume = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("volume")
        .name("Volume")
        .width(190)
        .renderOption(amounts => <DatatableItem.ActivityAmountStack amounts={amounts} />)
        .build();

    const createHeaderTransferCount = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("transferCount")
        .name("Transfers")
        .width(120)
        .renderOption(count => <span>{count}</span>)
        .build();

    const createHeaderRealmEvents = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("realmEvents")
        .name("Realm Events")
        .width(220)
        .renderOption(events => <DatatableItem.RealmEventsSummary events={events} />)
        .build();

    const createHeaderTime = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("timestamp")
        .name("Time")
        .width(160)
        .className("time")
        .renderOption(date => <DatatableItem.Date date={date} />)
        .build();

    const createHeaderFee = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("fee")
        .name("Fee")
        .className("fee")
        .width(113)
        .renderOption(({ value, denom }: { value: string; denom: string }) => (
          <DatatableItem.Amount {...getTokenAmount(denom, value)} />
        ))
        .build();

    const createHeaderToggle = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("txHash")
        .name("")
        .width(100)
        .renderOption(txHash => (
          <DatatableItem.ToggleDetails active={expandedRows.includes(txHash)} onClick={() => toggleRow(txHash)} />
        ))
        .build();

    const createHeaderNativeValue = () =>
      DatatableOption.Builder.builder<ActivityRow>()
        .key("nativeValue")
        .name("Native Value")
        .width(180)
        .renderOption(amount => <DatatableItem.ActivityAmountStack amounts={amount ? [amount] : []} />)
        .build();
    switch (variant) {
      case "direct":
        return [
          createHeaderTxHash(),
          createHeaderFunction(),
          createHeaderBlock(),
          createHeaderCaller(),
          createHeaderNativeValue(),
          createHeaderFee(),
          createHeaderTime(),
          createHeaderToggle(),
        ];
      case "transfers":
        return [
          createHeaderTxHash(),
          createHeaderFunction(),
          createHeaderBlock(),
          createHeaderAmountIn(),
          createHeaderAmountOut(),
          createHeaderFee(),
          createHeaderTime(),
          createHeaderToggle(),
        ];
      case "token-volume":
        return [
          createHeaderTxHash(),
          createHeaderFunction(),
          createHeaderBlock(),
          createHeaderVolume(),
          createHeaderTransferCount(),
          createHeaderFee(),
          createHeaderTime(),
          createHeaderToggle(),
        ];
      case "internal":
        return [
          createHeaderTxHash(),
          createHeaderFunction(),
          createHeaderRealmEvents(),
          createHeaderBlock(),
          createHeaderFee(),
          createHeaderTime(),
          createHeaderToggle(),
        ];
      default:
        return [];
    }
  }, [variant, expandedRows, getTokenAmount]);

  const renderDetails = (row: ActivityRow) => {
    const visible = expandedRows.includes(row.txHash);
    if (variant === "direct") {
      return <ActivityMessagesDetail visible={visible} messages={row.messages} />;
    }
    if (variant === "internal") {
      return <ActivityRealmEventsDetail visible={visible} events={row.realmEvents} />;
    }
    return <ActivityTransfersDetail visible={visible} transfers={row.transfers} />;
  };

  return (
    <Container>
      <Datatable
        loading={!isFetched}
        headers={headers.map(item => ({ ...item, themeMode }))}
        datas={data}
        renderDetails={renderDetails}
      />
      {hasNextPage && nextPage ? (
        <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => nextPage()}>
          {moreLabel}
        </Button>
      ) : (
        <React.Fragment />
      )}
    </Container>
  );
};

const Container = styled.div<{ maxWidth?: number }>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;

    & > div {
      padding: 0;
    }

    .more-button {
      width: 100%;
      padding: 16px;
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
