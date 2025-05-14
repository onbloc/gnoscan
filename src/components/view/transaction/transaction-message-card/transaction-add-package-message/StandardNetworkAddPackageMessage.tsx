/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";

import { Amount } from "@/types/data-type";
import { AmountText } from "@/components/ui/text/amount-text";
import Badge from "@/components/ui/badge";

import { Field, BadgeText, AddressLink, PkgPathLink } from "@/components/view/transaction/common";

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
        <BadgeText>{MESSAGE_TYPES.VM_ADDPKG}</BadgeText>
      </Field>

      <Field label="Pkg Name" isDesktop={isDesktop}>
        <BadgeText>{message.name}</BadgeText>
      </Field>

      <Field label="Pkg Path" isDesktop={isDesktop}>
        <PkgPathLink path={creator} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>

      <Field label="Creator" isDesktop={isDesktop}>
        <AddressLink to={creator} copyText={creator} getUrlWithNetwork={getUrlWithNetwork} />
      </Field>

      <Field label="Files" isDesktop={isDesktop}>
        <BadgeText>{message.name}</BadgeText>
        <BadgeText>{message.name}</BadgeText>
      </Field>

      <Field label="Deposit" isDesktop={isDesktop}>
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

export default StandardNetworkAddPackageMessage;
