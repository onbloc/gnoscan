import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";
import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { Field, BadgeText, AddressLink, AmountBadge } from "@/components/ui/detail-field";

const StandardNetworkBankMsgSendMessage = ({ message, getUrlWithNetwork }: TransactionContractMessagesProps) => {
  const amount: Amount | null = React.useMemo(() => {
    if (!message?.amount) return null;

    return toGNOTAmount(message.amount.value, message.amount.denom);
  }, [message?.amount]);

  return (
    <>
      <Field label="Type">
        <BadgeText>{MESSAGE_TYPES.BANK_MSG_SEND}</BadgeText>
      </Field>

      <Field label="Function">
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message) || "-"}
        </BadgeText>
      </Field>

      <Field label="Amount">
        <AmountBadge amount={amount} />
      </Field>

      <Field label="From">
        <AddressLink
          address={message.from || ""}
          addressName={message.fromName}
          copyText={message.from || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.fromLabel}
          labelType={message.fromLabelType}
        />
      </Field>

      <Field label="To">
        <AddressLink
          address={message.to || ""}
          addressName={message.toName}
          copyText={message.to || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.toLabel}
          labelType={message.toLabelType}
        />
      </Field>
    </>
  );
};

export default StandardNetworkBankMsgSendMessage;
