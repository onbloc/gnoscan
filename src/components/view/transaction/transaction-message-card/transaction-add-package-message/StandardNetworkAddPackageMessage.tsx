/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import {
  Field,
  FieldWithTooltip,
  BadgeText,
  AddressLink,
  PkgPathLink,
  BadgeList,
  AmountBadge,
} from "@/components/view/transaction/common";
import { Amount } from "@/types";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";

const StandardNetworkAddPackageMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
  const send = React.useMemo(() => {
    if (!message?.deposit) return null;

    return toGNOTAmount(message.deposit.value, message.deposit.denom);
  }, [message?.deposit]);

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
        <BadgeText>{MESSAGE_TYPES.VM_ADDPKG}</BadgeText>
      </Field>

      <Field label="Pkg Name" isDesktop={isDesktop}>
        <BadgeText>{message.name}</BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <PkgPathLink path={message.pkgPath} getUrlWithNetwork={getUrlWithNetwork} isEllipsis={false} />
      </FieldWithTooltip>

      <Field label="Creator" isDesktop={isDesktop}>
        <AddressLink
          address={message.creator || ""}
          addressName={message.creatorName}
          copyText={message.creator || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Files" isDesktop={isDesktop}>
        <BadgeList items={message?.files} />
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

export default StandardNetworkAddPackageMessage;
