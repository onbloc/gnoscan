/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { TransactionContractModel } from "@/repositories/api/transaction/response";
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

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkMsgCallMessage = ({ isDesktop, message, getUrlWithNetwork }: TransactionTransferContractProps) => {
  const creator = message?.caller || "-";

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
          to={message.from || creator}
          copyText={message.from || creator}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="To" isDesktop={isDesktop}>
        <AddressLink to={message.to || "-"} copyText={message.to || ""} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>
    </>
  );

  const msgCallFields = (
    <>
      <Field label="Caller" isDesktop={isDesktop}>
        <AddressLink to={creator} copyText={creator} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>

      <Field label="Arguments" isDesktop={isDesktop}>
        <BadgeList items={message?.args} />
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
