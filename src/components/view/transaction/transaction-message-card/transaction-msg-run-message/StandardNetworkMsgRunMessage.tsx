/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { AmountBadge, BadgeTooltipProps, StorageDepositAmountBadge } from "../../common/TransactionMessageFields";

import { Field, BadgeText, AddressLink, BadgeList, HoverBadgeList } from "@/components/view/transaction/common";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkMsgRunMessage = ({ isDesktop, message, getUrlWithNetwork }: TransactionTransferContractProps) => {
  const calledFunctions: BadgeTooltipProps[] | null = React.useMemo(() => {
    if (!message?.calledFunctions) return null;

    return message.calledFunctions.map(msg => {
      return {
        label: msg.method,
        tooltip: msg.packagePath,
      };
    });
  }, [message?.calledFunctions]);

  const send = React.useMemo(() => {
    if (!message?.send) return null;

    return toGNOTAmount(message.send.value, message.send.denom);
  }, [message?.send]);

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
          address={message.caller || ""}
          addressName={message.callerName}
          copyText={message.caller || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Files" isDesktop={isDesktop}>
        <BadgeList items={message?.files} />
      </Field>

      <Field label="Called Functions" isDesktop={isDesktop}>
        <HoverBadgeList
          items={calledFunctions}
          linkUrl={"/realms/details?path="}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Storage Deposit" isDesktop={isDesktop}>
        <StorageDepositAmountBadge viewSize={false} />
      </Field>

      <Field label="Send" isDesktop={isDesktop}>
        <AmountBadge amount={send} />
      </Field>
    </>
  );
};

export default StandardNetworkMsgRunMessage;
