/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { Amount } from "@/types/data-type";

import { Field, BadgeText, HoverBadgeText, AddressLink } from "@/components/view/transaction/common";
import Badge from "@/components/ui/badge";
import { AmountText } from "@/components/ui/text/amount-text";

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
        <HoverBadgeText type="blue" color="white" tooltipContent="gno.land/r/gnoland/valoper">
          {MESSAGE_TYPES.VM_RUN}
        </HoverBadgeText>
        <HoverBadgeText type="blue" color="white" tooltipContent="gno.land/r/gnoland/valoper">
          {MESSAGE_TYPES.VM_RUN}
        </HoverBadgeText>
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
