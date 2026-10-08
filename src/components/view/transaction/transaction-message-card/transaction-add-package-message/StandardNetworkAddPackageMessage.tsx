import React from "react";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import ShowLog from "@/components/ui/show-log";
import { AddressLink, AmountBadge, BadgeText, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { BadgeList, PkgPathLink } from "@/components/view/transaction/common";
import { Amount } from "@/types";

const StandardNetworkAddPackageMessage = ({
  message,
  files = [],
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
  const send = React.useMemo(() => {
    if (!message?.deposit) return null;

    return toGNOTAmount(message.deposit.value, message.deposit.denom);
  }, [message?.deposit]);

  const maxDeposit: Amount | null = React.useMemo(() => {
    if (!message?.maxDeposit) return null;

    return toGNOTAmount(message.maxDeposit.value || "0", message.maxDeposit.denom || GNOTToken.denom);
  }, [message.maxDeposit]);

  return (
    <>
      <Field label="Type">
        <BadgeText>{MESSAGE_TYPES.VM_ADDPKG}</BadgeText>
      </Field>

      <Field label="Pkg Name">
        <BadgeText>{message.name}</BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH}>
        <PkgPathLink
          path={message.pkgPath}
          getUrlWithNetwork={getUrlWithNetwork}
          isEllipsis={false}
          visibleRealmStatus
        />
      </FieldWithTooltip>

      <Field label="Creator">
        <AddressLink
          address={message.creator || ""}
          addressName={message.creatorName}
          copyText={message.creator || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.creatorLabel}
          labelType={message.creatorLabelType}
        />
      </Field>

      <Field label="Files" className="top-aligned" contentClassName="files-wrapper">
        <BadgeList items={message?.files} />
        {files && files?.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Files" />}
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

export default StandardNetworkAddPackageMessage;
