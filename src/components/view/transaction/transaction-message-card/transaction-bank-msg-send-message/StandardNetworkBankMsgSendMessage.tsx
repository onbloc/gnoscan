/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";

import { Field, BadgeText, AddressLink } from "@/components/view/transaction/common";
import { AmountText } from "@/components/ui/text/amount-text";

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
  const creator = React.useMemo(() => {
    return message?.caller || "-";
  }, [message]);

  const amount: Amount | null = React.useMemo(() => {
    if (!message?.amount) return null;

    return toGNOTAmount(message.amount.value, message.amount.denom);
  }, [message?.amount]);

  const getContractType = React.useCallback((message: any) => {
    switch (message.messageType) {
      case "BankMsgSend":
        return "Transfer";
      case "AddPackage":
        return "AddPackage";
      case "MsgCall":
        return message["funcType"] || message["messageType"];
      case "MsgRun":
        return "MsgRun";
    }
  }, []);

  return (
    <>
      <Field label="Type" isDesktop={isDesktop}>
        <BadgeText>{MESSAGE_TYPES.BANK_MSG_SEND}</BadgeText>
      </Field>

      <Field label="Function" isDesktop={isDesktop}>
        <BadgeText type="blue">{getContractType(message) || "-"}</BadgeText>
      </Field>

      <Field label="Amount" isDesktop={isDesktop}>
        <BadgeText>
          <AmountText
            minSize="body2"
            maxSize="p4"
            value={amount?.value || "0"}
            denom={amount?.denom || GNOTToken.symbol}
          />
        </BadgeText>
      </Field>

      <Field label="From" isDesktop={isDesktop}>
        <AddressLink
          to={message.from || creator}
          copyText={message.from || creator}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="To" isDesktop={isDesktop}>
        <AddressLink
          to={message.from || creator}
          copyText={message.from || creator}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>
    </>
  );
};

export default StandardNetworkBankMsgSendMessage;
