/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { AmountBadge, BadgeTooltipProps, StorageDepositAmountBadge } from "../../common/TransactionMessageFields";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { Field, BadgeText, AddressLink, BadgeList, HoverBadgeList } from "@/components/view/transaction/common";
import { Amount } from "@/types";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";

const StandardNetworkMsgRunMessage = ({ isDesktop, message, getUrlWithNetwork }: TransactionContractMessagesProps) => {
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

  const maxDeposit: Amount | null = React.useMemo(() => {
    if (!message.maxDeposit) return null;

    return {
      value: message.maxDeposit || "0",
      denom: GNOTToken.denom,
    };
  }, [message.maxDeposit]);

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

      <Field label="Send" isDesktop={isDesktop}>
        <AmountBadge amount={send} />
      </Field>

      <Field label="Max_Deposit" isDesktop={isDesktop}>
        <AmountBadge amount={maxDeposit} />
      </Field>
    </>
  );
};

export default StandardNetworkMsgRunMessage;
