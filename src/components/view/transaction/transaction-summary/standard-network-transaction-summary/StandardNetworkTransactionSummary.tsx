/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import DataSection from "@/components/view/details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import { AmountText } from "@/components/ui/text/amount-text";
import ShowLog from "@/components/ui/show-log";
import { StyledIconCopy } from "../Transaction.styles";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { useMappedApiTransaction } from "@/common/services/transaction/use-mapped-api-transaction";
import { Amount } from "@/types/data-type";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";

interface TransactionSummaryProps {
  isDesktop: boolean;
  txHash: string;
  txErrorType: string;
  blockResultLog: string | null;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkTransactionSummary = ({
  isDesktop,
  txHash,
  txErrorType,
  blockResultLog,
  getUrlWithNetwork,
}: TransactionSummaryProps) => {
  const { data, isFetched } = useMappedApiTransaction(txHash);

  const transactionFee: Amount | null = React.useMemo(() => {
    if (!data?.transactionItem?.fee) return null;

    const fee = data.transactionItem.fee;
    return toGNOTAmount(fee.value, fee.denom);
  }, [data?.transactionItem?.fee]);

  const displayBlockHeight = React.useMemo(() => {
    if (!data?.transactionItem) return "-";
    return formatDisplayBlockHeight(data.transactionItem?.blockHeight);
  }, [data.transactionItem?.blockHeight]);

  const displayTxErrorInfo = React.useMemo(() => {
    if (!txErrorType) return "Failed";
    return `Failed: ${txErrorType}`;
  }, [txErrorType]);

  if (!isFetched) return <TableSkeleton />;

  return (
    data?.transactionItem && (
      <DataSection title="Summary">
        <DLWrap desktop={isDesktop}>
          <dt>Success</dt>
          <dd>
            <Badge type={data.transactionItem.success ? "green" : "failed"}>
              <Text type="p4" color="white">
                {data.transactionItem.success ? "Success" : displayTxErrorInfo}
              </Text>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Timestamp</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {data.timeStamp.time}
              </Text>
              <DateDiffText>{data.timeStamp.passedTime}</DateDiffText>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Tx Hash</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {txHash}
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={txHash}>
                <StyledIconCopy className="svg-icon" />
              </Tooltip>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Network</dt>
          <dd>
            <Badge>{data.network}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Block</dt>
          <dd>
            <Badge>
              <Link href={getUrlWithNetwork(`/block/${data.transactionItem.blockHeight}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {displayBlockHeight}
                  </Text>
                </FitContentA>
              </Link>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Transaction Fee</dt>
          <dd>
            <Badge>
              <AmountText
                minSize="body2"
                maxSize="p4"
                value={transactionFee?.value || "0"}
                denom={transactionFee?.denom || GNOTToken.symbol}
              />
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Gas (Used/Wanted)</dt>
          <dd>
            <Badge>{data.gas}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Memo</dt>
          <dd>
            <Badge>{data.transactionItem.memo || "-"}</Badge>
          </dd>
        </DLWrap>
        {!data.transactionItem.success && (
          <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
        )}
      </DataSection>
    )
  );
};

export default StandardNetworkTransactionSummary;
