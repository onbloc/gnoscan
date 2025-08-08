/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";
import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { Field, BadgeText, AddressLink, AmountBadge } from "@/components/view/transaction/common";

const StandardNetworkBankMsgSendMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
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
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message) || "-"}
        </BadgeText>
      </Field>

      <Field label="Amount" isDesktop={isDesktop}>
        <AmountBadge amount={amount} />
      </Field>

      <Field label="From" isDesktop={isDesktop}>
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
};

export default StandardNetworkBankMsgSendMessage;
