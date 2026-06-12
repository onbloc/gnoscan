import React from "react";

import { getLocalDateString } from "@/common/utils/date-util";
import { getTransactionMessageType } from "@/common/utils/message.utility";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";
import { Amount } from "@/types/data-type";

import { AddressLink, AmountBadge, BadgeList, BadgeText, Field } from "@/components/view/transaction/common";

const StandardNetworkCreateSessionMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
  const session = message.session;

  const spendLimit: Amount | null = React.useMemo(() => {
    if (!session?.spendLimit) return null;

    return toGNOTAmount(session.spendLimit.value || "0", session.spendLimit.denom || "");
  }, [session?.spendLimit]);

  // `expiresAt` is a unix timestamp in seconds; convert to milliseconds for display.
  const expiresAt = React.useMemo(() => {
    if (session?.expiresAt === undefined || session?.expiresAt === null) return "-";

    return getLocalDateString(session.expiresAt * 1000);
  }, [session?.expiresAt]);

  // `spendPeriod` is expressed in seconds.
  const spendPeriod = React.useMemo(() => {
    if (!session?.spendPeriod) return "-";

    return `${session.spendPeriod}s`;
  }, [session?.spendPeriod]);

  return (
    <>
      <Field label="Type" isDesktop={isDesktop}>
        <BadgeText>{MESSAGE_TYPES.AUTH_CREATE_SESSION}</BadgeText>
      </Field>

      <Field label="Function" isDesktop={isDesktop}>
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message) || "-"}
        </BadgeText>
      </Field>

      <Field label="Creator" isDesktop={isDesktop}>
        <AddressLink
          address={message.creator || ""}
          addressName={message.creatorName}
          copyText={message.creator || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      <Field label="Session Key" isDesktop={isDesktop}>
        <BadgeText>{session?.sessionKey || "-"}</BadgeText>
      </Field>

      <Field label="Spend Limit" isDesktop={isDesktop}>
        <AmountBadge amount={spendLimit} />
      </Field>

      <Field label="Spend Period" isDesktop={isDesktop}>
        <BadgeText>{spendPeriod}</BadgeText>
      </Field>

      <Field label="Expires At" isDesktop={isDesktop}>
        <BadgeText>{expiresAt}</BadgeText>
      </Field>

      <Field label="Allow Paths" isDesktop={isDesktop}>
        <BadgeList items={session?.allowPaths ?? []} />
      </Field>
    </>
  );
};

export default StandardNetworkCreateSessionMessage;
