import React from "react";
import Link from "next/link";

import DataSection from "@/components/view/details-data-section";
import { Field, FieldWithTooltip, StorageDepositAmountBadge } from "@/components/ui/detail-field";
import { DateDiffText, DLWrap, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { AmountText } from "@/components/ui/text/amount-text";
import { UsdValueText } from "@/components/ui/text/usd-value-text";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { useMappedApiTransaction } from "@/common/services/transaction/use-mapped-api-transaction";
import { Amount } from "@/types/data-type";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";
import { toDisplayHash } from "@/common/utils/transaction.utility";
import TransactionSuccessWarningTooltip from "@/components/ui/tooltip/transaction-success-warning-tooltip/TransactionSuccessWarningTooltip";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { DEFAULT_TX_STORAGE_DEPOSIT } from "@/common/values/default-object/transaction";

interface TransactionSummaryProps {
  isDesktop: boolean;
  txHash: string;
  txErrorType: string;
  blockResultLog: string | null;
  getUrlWithNetwork: (uri: string) => string;
}

const TOOLTIP_STORAGE_DEPOSIT = (
  <>The total amount of GNOT deposited or released for storage usage by this transaction.</>
);

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

  const displayStorageDeposit: StorageDeposit | null = React.useMemo(() => {
    if (!data?.storageDeposit) return null;

    return {
      deposit: Number(data.storageDeposit?.value || DEFAULT_TX_STORAGE_DEPOSIT.deposit),
      storage: Number(data.storageUsage || DEFAULT_TX_STORAGE_DEPOSIT.storage),
    };
  }, [data?.storageDeposit, data?.storageUsage]);

  const hasApplicationError = Boolean(data?.hasApplicationError);
  const isPending = Boolean(data?.transactionItem?.isPending);

  const txHashDisplay = data.transactionItem?.hash ? toDisplayHash(data.transactionItem.hash) : "";

  if (!isFetched) return <TableSkeleton />;

  return (
    data?.transactionItem && (
      <DataSection title="Summary">
        <DLWrap desktop={isDesktop}>
          <dt>Status</dt>
          <dd style={{ display: "flex" }}>
            <Badge type={isPending ? "pending" : data.transactionItem.success ? "green" : "failed"}>
              <Text type="p4" color="white">
                {isPending ? "Pending" : data.transactionItem.success ? "Success" : displayTxErrorInfo}
              </Text>
            </Badge>
            {!isPending && hasApplicationError && <TransactionSuccessWarningTooltip />}
          </dd>
        </DLWrap>
        {!isPending && (
          <Field label="Timestamp" isDesktop={isDesktop}>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {data.timeStamp.time}
              </Text>
              <DateDiffText>{data.timeStamp.passedTime}</DateDiffText>
            </Badge>
          </Field>
        )}
        <Field label="Tx Hash" isDesktop={isDesktop}>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {txHashDisplay || "-"}
            </Text>
            {txHashDisplay && <CopyTooltip copyText={txHashDisplay} />}
          </Badge>
        </Field>
        <Field label="Tx Hash (base64)" isDesktop={isDesktop}>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {data.transactionItem.hashBase64 || "-"}
            </Text>
            {data.transactionItem.hashBase64 && <CopyTooltip copyText={data.transactionItem.hashBase64} />}
          </Badge>
        </Field>
        {!isPending && (
          <Field label="Network" isDesktop={isDesktop}>
            <Badge>{data.network}</Badge>
          </Field>
        )}
        {!isPending && (
          <Field label="Block" isDesktop={isDesktop}>
            <Badge>
              <Link href={getUrlWithNetwork(`/block/${data.transactionItem.blockHeight}`)} passHref>
                <FitContentSpan>
                  <Text type="p4" color="blue">
                    {displayBlockHeight}
                  </Text>
                </FitContentSpan>
              </Link>
            </Badge>
          </Field>
        )}
        <Field label="Transaction Fee" isDesktop={isDesktop}>
          <Badge>
            <AmountText
              minSize="body1"
              maxSize="p4"
              denomSize="body2"
              value={transactionFee?.value || "0"}
              denom={transactionFee?.denom || GNOTToken.symbol}
            />
            <UsdValueText tokenKey={GNOTToken.denom} amount={transactionFee?.value || "0"} />
          </Badge>
        </Field>
        <Field label={isPending ? "Gas Wanted" : "Gas (Used/Wanted)"} isDesktop={isDesktop}>
          <Badge>{isPending ? data.transactionItem.gasWanted ?? "-" : data.gas}</Badge>
        </Field>
        {!isPending && (
          <FieldWithTooltip label="Storage Deposit" tooltipContent={TOOLTIP_STORAGE_DEPOSIT} isDesktop={isDesktop}>
            <StorageDepositAmountBadge
              storageDeposit={displayStorageDeposit}
              visibleStorageSize={true}
              visibleTooltip={false}
              visibleUsd
            />
          </FieldWithTooltip>
        )}
        <Field label="Memo" isDesktop={isDesktop}>
          <Badge>{data.transactionItem.memo || "-"}</Badge>
        </Field>
        {!isPending && !data.transactionItem.success && (
          <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
        )}
      </DataSection>
    )
  );
};

export default StandardNetworkTransactionSummary;
