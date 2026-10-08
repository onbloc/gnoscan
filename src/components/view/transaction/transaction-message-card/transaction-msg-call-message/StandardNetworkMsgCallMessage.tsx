import React from "react";

import { getTransactionMessageType } from "@/common/utils/message.utility";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "@/common/values/message-types.constant";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTokenMetaAmount } from "@/common/hooks/tokens/use-token-meta-amount";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { AddressLink, AmountBadge, BadgeText, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { BadgeList, PkgPathLink } from "@/components/view/transaction/common";
import { Amount } from "@/types";

const StandardNetworkMsgCallMessage = ({ message, getUrlWithNetwork }: TransactionContractMessagesProps) => {
  const { amount, isFetched, isLoading } = useTokenMetaAmount(message?.amount);

  const maxDeposit: Amount | null = React.useMemo(() => {
    if (!message?.maxDeposit || !message.maxDeposit.value || message.maxDeposit.value === "0") return null;

    return toGNOTAmount(message.maxDeposit.value, message.maxDeposit.denom || GNOTToken.denom);
  }, [message.maxDeposit]);

  const isTransferType = message.funcType === TRANSACTION_FUNCTION_TYPES.TRANSFER && message.args.length == 2;

  const commonFields = (
    <>
      <Field label="Type">
        <BadgeText>{MESSAGE_TYPES.VM_CALL}</BadgeText>
      </Field>

      <Field label="Function">
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message)}
        </BadgeText>
      </Field>

      <Field label="Pkg Name">
        <BadgeText>{message.pkgName || "-"}</BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH}>
        <PkgPathLink path={message.pkgPath || "-"} getUrlWithNetwork={getUrlWithNetwork} visibleRealmStatus />
      </FieldWithTooltip>
    </>
  );

  const transferFields = (
    <>
      <Field label="Amount">
        {isLoading && <SkeletonBar width={80} />}
        {!isLoading && isFetched && <AmountBadge amount={amount} />}
      </Field>

      <Field label="Caller (From)">
        <AddressLink
          address={message.from || ""}
          addressName={message.fromName}
          copyText={message.from || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.fromLabel}
          labelType={message.fromLabelType}
        />
      </Field>

      <Field label="To">
        <AddressLink
          address={message.to || ""}
          addressName={message.toName}
          copyText={message.to || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.toLabel}
          labelType={message.toLabelType}
        />
      </Field>
    </>
  );

  const msgCallFields = (
    <>
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

      <Field label="Arguments">
        <BadgeList items={message?.args} />
      </Field>

      <Field label="Send">
        <AmountBadge amount={message?.send} />
      </Field>

      {maxDeposit && (
        <Field label="Max_Deposit">
          <AmountBadge amount={maxDeposit} />
        </Field>
      )}
    </>
  );

  return (
    <>
      {commonFields}
      {isTransferType ? transferFields : msgCallFields}
    </>
  );
};

export default StandardNetworkMsgCallMessage;
