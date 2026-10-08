import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";
import { AmountBadge, AddressLink, BadgeText, Field } from "@/components/ui/detail-field";
import { BadgeTooltipProps } from "../../common/TransactionMessageFields";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import ShowLog from "@/components/ui/show-log";
import { BadgeList, HoverBadgeList } from "@/components/view/transaction/common";
import { Amount } from "@/types";

const StandardNetworkMsgRunMessage = ({ message, files = [], getUrlWithNetwork }: TransactionContractMessagesProps) => {
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
    if (!message?.maxDeposit) return null;

    return toGNOTAmount(message.maxDeposit.value || "0", message.maxDeposit.denom || GNOTToken.denom);
  }, [message.maxDeposit]);

  return (
    <>
      <Field label="Type">
        <BadgeText>{MESSAGE_TYPES.VM_RUN}</BadgeText>
      </Field>

      <Field label="Pkg Name">
        <BadgeText>{message.name || "-"}</BadgeText>
      </Field>

      <Field label="Caller">
        <AddressLink
          address={message.caller || ""}
          addressName={message.callerName}
          copyText={message.caller || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.callerLabel}
          labelType={message.callerLabelType}
        />
      </Field>

      <Field label="Files" className="top-aligned" contentClassName="files-wrapper">
        <BadgeList items={message?.files} />
        {files && files?.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Files" />}
      </Field>

      <Field label="Called Functions">
        <HoverBadgeList
          items={calledFunctions}
          linkUrl={"/realms/details?path="}
          getUrlWithNetwork={getUrlWithNetwork}
          visibleRealmStatus
        />
      </Field>

      <Field label="Send">
        <AmountBadge amount={send} />
      </Field>

      <Field label="Max_Deposit">
        <AmountBadge amount={maxDeposit} />
      </Field>
    </>
  );
};

export default StandardNetworkMsgRunMessage;
