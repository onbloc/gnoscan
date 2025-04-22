"use client";

import React, { useEffect, useState } from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import theme from "@/styles/theme";
import { DatatableItem } from "..";
import { eachMedia } from "@/common/hooks/use-media";
import { useRecoilValue } from "recoil";
import { themeState } from "@/states";
import { useAccount } from "@/common/hooks/account/use-account";
import { Amount, Transaction } from "@/types/data-type";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

interface Props {
  address: string;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

export const AccountDetailDatatable = ({ address }: Props) => {
  const themeMode = useRecoilValue(themeState);
  const media = eachMedia();

  const { getTokenAmount } = useTokenMeta();
  const { isFetchedAccountTransactions, accountTransactions, hasNextPage, nextPage } = useAccount(address);
  const [development, setDevelopment] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydownEvent);
    window.addEventListener("keyup", handleKeyupEvent);

    return () => {
      window.removeEventListener("keydown", handleKeydownEvent);
      window.removeEventListener("keyup", handleKeyupEvent);
    };
  }, []);

  const handleKeydownEvent = (event: KeyboardEvent) => {
    if (event.code === "Backquote") {
      setDevelopment(true);
      setTimeout(() => setDevelopment(false), 500);
    }
  };

  const handleKeyupEvent = (event: KeyboardEvent) => {
    if (event.code === "Backquote") {
      setDevelopment(false);
    }
  };

  const createHeaders = () => {
    return [
      createHeaderTxHash(),
      createHeaderType(),
      createHeaderBlock(),
      createHeaderAmountIn(),
      createHeaderAmountOut(),
      createHeaderTime(),
      createHeaderFee(),
    ];
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("hash")
      .name("Tx Hash")
      .width(215)
      .colorName("blue")
      .renderOption((value, data) => (
        <DatatableItem.TxHash
          txHash={value}
          status={data.success ? "success" : "failure"}
          development={development}
          height={data.blockHeight}
        />
      ))
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("type")
      .name("Type")
      .width(190)
      .colorName("blue")
      .tooltip(TOOLTIP_TYPE)
      .renderOption((_, data) => (
        <DatatableItem.Type
          type={data.type}
          func={data.functionName}
          packagePath={data.packagePath}
          msgNum={data.numOfMessage}
        />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("blockHeight")
      .name("Block")
      .width(113)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderAmountIn = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("amount")
      .name("Amount (In)")
      .width(180)
      .renderOption((amount: Amount, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : (
          <DatatableItem.Amount {...getTokenAmount(amount?.denom || "", amount?.value || 0)} />
        ),
      )
      .build();
  };

  const createHeaderAmountOut = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("amountOut")
      .name("Amount (Out)")
      .width(180)
      .renderOption((amount: Amount, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : (
          <DatatableItem.Amount {...getTokenAmount(amount?.denom || "", amount?.value || 0)} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("time")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("fee")
      .name("Fee")
      .className("fee")
      .width(113)
      .renderOption(({ value, denom }: { value: string; denom: string }) => (
        <DatatableItem.Amount {...getTokenAmount(denom, value)} />
      ))
      .build();
  };

  return (
    <Container>
      <Datatable
        loading={!isFetchedAccountTransactions}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={accountTransactions || []}
      />
      {hasNextPage ? (
        <Button className={`more-button ${media}`} radius={"4px"} onClick={() => nextPage()}>
          {"View More Transactions"}
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
