/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";

import {
  Field,
  FieldWithTooltip,
  BadgeText,
  AddressLink,
  PkgPathLink,
  BadgeList,
  AmountBadge,
} from "@/components/view/transaction/common";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkAddPackageMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionTransferContractProps) => {
  const deposit = React.useMemo(() => {
    if (!message?.deposit) return null;

    return toGNOTAmount(message.deposit.value, message.deposit.denom);
  }, [message?.deposit]);

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

      <Field label="Deposit" isDesktop={isDesktop}>
        <AmountBadge amount={deposit} />
      </Field>
    </>
  );
};

export default StandardNetworkAddPackageMessage;
