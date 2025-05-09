"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { themeState } from "@/states";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

import * as S from "./StandardNetworkTransactionListTable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "@/components/view/datatable";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { TransactionModel } from "@/models/api/transaction/transaction-model";

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

function mapDisplayFunctionName(type: string, functionName: string) {
  switch (type) {
    case "MsgAddPackage":
      return "AddPkg";
    case "BankMsgSend":
      return "Transfer";
    default:
      return functionName;
  }
}

interface StandardNetworkTransactionListTableProps {
  breakpoint: DEVICE_TYPE;
  transactions: TransactionModel[];
  hasNextPage?: boolean;
  isFetched: boolean;
  isLoading: boolean;
  nextPage: () => void;
}

export const StandardNetworkTransactionListTable = ({
  breakpoint,
  transactions,
  hasNextPage,
  nextPage,
  isFetched,
  isLoading,
}: StandardNetworkTransactionListTableProps) => {
  const themeMode = useRecoilValue(themeState);

  const { getTokenAmount } = useTokenMeta();
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
      createHeaderFrom(),
      createHeaderAmount(),
      createHeaderTime(),
      createHeaderFee(),
    ];
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("txHash")
      .name("Tx hash")
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
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("type")
      .name("Function")
      .width(190)
      .colorName("blue")
      .tooltip(<S.TooltipContainer>{TOOLTIP_TYPE}</S.TooltipContainer>)
      .renderOption((_, data) => {
        const func = data.func[0];
        const displayFunctionName = mapDisplayFunctionName(func.pkgPath, func.funcType);
        return (
          <DatatableItem.Type
            type={func.messageType}
            func={displayFunctionName}
            packagePath={func.pkgPath}
            msgNum={data.numOfMessage - 1}
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
      .renderOption((address, data) => <DatatableItem.Publisher address={address} username={address} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("amount")
      .name("Amount")
      .width(190)
      .renderOption((_, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.txHash}`} />
        ) : (
          <DatatableItem.Amount {...getTokenAmount(data.amount.denom, data.amount.value)} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("timestamp")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionModel>()
      .key("fee")
      .name("Fee")
      .width(113)
      .className("fee")
      .renderOption(fee => <DatatableItem.Amount {...getTokenAmount(fee.denom, fee.value)} />)
      .build();
  };

  if (isLoading || !isFetched) return <TableSkeleton />;

  return (
    <S.Container>
      <Datatable
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={transactions}
      />
      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => nextPage()}>
            {"View More Transactions"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </S.Container>
  );
};
