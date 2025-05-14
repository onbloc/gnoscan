/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";

import { Amount } from "@/types/data-type";
import Badge from "@/components/ui/badge";
import { AmountText } from "@/components/ui/text/amount-text";

import { Field, BadgeText, AddressLink } from "@/components/view/transaction/common";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkMsgRunMessage = ({ isDesktop, message, getUrlWithNetwork }: TransactionTransferContractProps) => {
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
        <BadgeText>{MESSAGE_TYPES.VM_RUN}</BadgeText>
      </Field>

      <Field label="Pkg Name" isDesktop={isDesktop}>
        <BadgeText>{message.name || "-"}</BadgeText>
      </Field>

      <Field label="Caller" isDesktop={isDesktop}>
        <AddressLink
          to={message.from || creator}
          copyText={message.from || creator}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Files" isDesktop={isDesktop}>
        <BadgeText>{MESSAGE_TYPES.VM_RUN}</BadgeText>
        <BadgeText>{MESSAGE_TYPES.VM_RUN}</BadgeText>
      </Field>

      <Field label="Called Functions" isDesktop={isDesktop}>
        <BadgeText type="blue" color="white">
          {MESSAGE_TYPES.VM_RUN}
        </BadgeText>
        <BadgeText type="blue" color="white">
          {MESSAGE_TYPES.VM_RUN}
        </BadgeText>
      </Field>

      <Field label="Send" isDesktop={isDesktop}>
        <Badge>
          <AmountText
            minSize="body2"
            maxSize="p4"
            value={amount?.value || "0"}
            denom={amount?.denom || GNOTToken.symbol}
          />
        </Badge>
      </Field>
    </>
  );
};

export default StandardNetworkMsgRunMessage;
