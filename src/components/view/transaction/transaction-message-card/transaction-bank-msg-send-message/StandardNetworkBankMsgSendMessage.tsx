/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";
import { getTransactionMessageType } from "@/common/utils/message.utility";

import { Field, BadgeText, AddressLink, AmountBadge } from "@/components/view/transaction/common";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkBankMsgSendMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionTransferContractProps) => {
  const amount: Amount | null = React.useMemo(() => {
    if (!message?.amount) return null;

    return toGNOTAmount(message.amount.value, message.amount.denom);
  }, [message?.amount]);

  return (
    <>
      <Field label="Type" isDesktop={isDesktop}>
        <BadgeText>{MESSAGE_TYPES.BANK_MSG_SEND}</BadgeText>
      </Field>

      <Field label="Function" isDesktop={isDesktop}>
        <BadgeText type="blue">{getTransactionMessageType(message) || "-"}</BadgeText>
      </Field>

      <Field label="Amount" isDesktop={isDesktop}>
        <AmountBadge amount={amount} />
      </Field>

      <Field label="From" isDesktop={isDesktop}>
        <AddressLink to={message.from || ""} copyText={message.from || ""} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>

      <Field label="To" isDesktop={isDesktop}>
        <AddressLink to={message.to || ""} copyText={message.to || ""} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>
    </>
  );
};

export default StandardNetworkBankMsgSendMessage;
