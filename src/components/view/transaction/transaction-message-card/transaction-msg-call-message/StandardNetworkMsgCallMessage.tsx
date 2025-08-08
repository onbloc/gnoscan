/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { TransactionContractMessagesProps } from "@/models/api/transaction";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "@/common/values/message-types.constant";
import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";

import {
  Field,
  FieldWithTooltip,
  BadgeText,
  AddressLink,
  PkgPathLink,
  BadgeList,
  AmountBadge,
} from "@/components/view/transaction/common";
import { useTokenMetaAmount } from "@/common/hooks/tokens/use-token-meta-amount";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { StorageDepositAmountBadge } from "../../common/TransactionMessageFields";

const StandardNetworkMsgCallMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
  storageDepositInfo,
}: TransactionContractMessagesProps) => {
  const { amount, isFetched, isLoading } = useTokenMetaAmount(message?.amount);

  const isTransferType = message.funcType === TRANSACTION_FUNCTION_TYPES.TRANSFER;

  const commonFields = (
    <>
      <Field label="Type" isDesktop={isDesktop}>
        <BadgeText>{MESSAGE_TYPES.VM_CALL}</BadgeText>
      </Field>

      <Field label="Function" isDesktop={isDesktop}>
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message)}
        </BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <PkgPathLink path={message.pkgPath || "-"} getUrlWithNetwork={getUrlWithNetwork} />
      </FieldWithTooltip>
    </>
  );

  const transferFields = (
    <>
      <Field label="Amount" isDesktop={isDesktop}>
        {isLoading && <SkeletonBar width={80} />}
        {!isLoading && isFetched && <AmountBadge amount={amount} />}
      </Field>

      <Field label="Caller (From)" isDesktop={isDesktop}>
        <AddressLink
          address={message.from || ""}
          addressName={message.fromName}
          copyText={message.from || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="To" isDesktop={isDesktop}>
        <AddressLink
          address={message.to || ""}
          addressName={message.toName}
          copyText={message.to || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>
    </>
  );

  const msgCallFields = (
    <>
      <Field label="Caller" isDesktop={isDesktop}>
        <AddressLink
          address={message.caller || ""}
          addressName={message.callerName}
          copyText={message.caller || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Arguments" isDesktop={isDesktop}>
        <BadgeList items={message?.args} />
      </Field>

      <Field label="Storage Deposit" isDesktop={isDesktop}>
        <StorageDepositAmountBadge
          storageDeposit={storageDepositInfo}
          visibleStorageSize={true}
          visibleTooltip={false}
        />
      </Field>

      <Field label="Send" isDesktop={isDesktop}>
        <AmountBadge amount={message?.send} />
      </Field>
    </>
  );

  return (
    <>
      {commonFields}
      {isTransferType ? transferFields : msgCallFields}
    </>
  );
};

export default StandardNetworkMsgCallMessage;
