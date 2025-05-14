/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";
import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";

import { Field, FieldWithTooltip, BadgeText, AddressLink, PkgPathLink } from "@/components/view/transaction/common";
import { AmountText } from "@/components/ui/text/amount-text";
import Badge from "@/components/ui/badge";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkMsgCallMessage = ({ isDesktop, message, getUrlWithNetwork }: TransactionTransferContractProps) => {
  const creator = React.useMemo(() => {
    return message?.caller || "-";
  }, [message]);

  const amount: Amount | null = React.useMemo(() => {
    if (!message?.amount) return null;

    return toGNOTAmount(message.amount.value, message.amount.denom);
  }, [message?.amount]);

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

      <Field label="Pkg Name" isDesktop={isDesktop}>
        <BadgeText>{message.name || "-"}</BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <PkgPathLink path={message.pkgPath || "-"} getUrlWithNetwork={getUrlWithNetwork} />
      </FieldWithTooltip>
    </>
  );

  const transferFields = (
    <>
      <Field label="Amount" isDesktop={isDesktop}>
        <Badge>
          <AmountText
            minSize="body2"
            maxSize="p4"
            value={amount?.value || "0"}
            denom={amount?.denom || GNOTToken.symbol}
          />
        </Badge>
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
        <BadgeText>-</BadgeText>
      </Field>

      <Field label="Send" isDesktop={isDesktop}>
        <BadgeText>-</BadgeText>
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
