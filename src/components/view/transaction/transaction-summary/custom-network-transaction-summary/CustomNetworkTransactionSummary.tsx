import React from "react";
import Link from "next/link";

import { TransactionSummaryInfo } from "@/types/data-type";

import DataSection from "@/components/view/details-data-section";
import { Field } from "@/components/ui/detail-field";
import { DateDiffText, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { AmountText } from "@/components/ui/text/amount-text";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

interface TransactionSummaryProps {
  txHash: string;
  transactionSummaryInfo: TransactionSummaryInfo;
  txErrorType: string;
  isFetchedTxRpcData: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const CustomNetworkTransactionSummary = ({
  txHash,
  transactionSummaryInfo,
  txErrorType,
  isFetchedTxRpcData,
  getUrlWithNetwork,
}: TransactionSummaryProps) => {
  const { txResult, transactionItem } = transactionSummaryInfo;

  const blockResultLog = React.useMemo(() => {
    if (transactionItem?.success) return null;

    try {
      return JSON.stringify(txResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionItem, txResult]);

  const displayTxErrorInfo = React.useMemo(() => {
    if (!txErrorType) return "Failed";
    return `Failed: ${txErrorType}`;
  }, [txErrorType]);

  if (!isFetchedTxRpcData) return <TableSkeleton />;

  return (
    transactionSummaryInfo.transactionItem && (
      <DataSection title="Summary">
        <Field label="Status">
          <Badge type={transactionSummaryInfo.transactionItem.success ? "green" : "failed"}>
            <Text type="p4" color="white">
              {transactionSummaryInfo.transactionItem.success ? "Success" : displayTxErrorInfo}
            </Text>
          </Badge>
        </Field>
        <Field label="Timestamp">
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {transactionSummaryInfo.timeStamp.time}
            </Text>
            <DateDiffText>{transactionSummaryInfo.timeStamp.passedTime}</DateDiffText>
          </Badge>
        </Field>
        <Field label="Tx Hash">
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {txHash}
            </Text>
            <CopyTooltip copyText={txHash} />
          </Badge>
        </Field>
        <Field label="Network">
          <Badge>{transactionSummaryInfo.network}</Badge>
        </Field>
        <Field label="Block">
          <Badge>
            <Link href={getUrlWithNetwork(`/block/${transactionSummaryInfo.transactionItem.blockHeight}`)} passHref>
              <FitContentSpan>
                <Text type="p4" color="blue">
                  {transactionSummaryInfo.transactionItem.blockHeight}
                </Text>
              </FitContentSpan>
            </Link>
          </Badge>
        </Field>
        <Field label="Transaction Fee">
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              value={transactionSummaryInfo.transactionItem.fee.value}
              denom={transactionSummaryInfo.transactionItem.fee.denom}
            />
          </Badge>
        </Field>
        <Field label="Gas (Used/Wanted)">
          <Badge>{transactionSummaryInfo.gas}</Badge>
        </Field>
        <Field label="Memo">
          <Badge>{transactionSummaryInfo.transactionItem.memo}</Badge>
        </Field>
        {!transactionSummaryInfo.transactionItem.success && (
          <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
        )}
      </DataSection>
    )
  );
};

export default CustomNetworkTransactionSummary;
