import React from "react";

import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { AddressLink, BadgeText, Field, FieldWithTooltip, PkgPathLink } from "@/components/view/transaction/common";

// `enable_package` messages carry `[pkgHash, pkgHeight]` in `args`
// (see onbloc-api-v3 `newEnablePackageMessageByEntity`).
const ARG_INDEX_PKG_HASH = 0;
const ARG_INDEX_PKG_HEIGHT = 1;

const StandardNetworkEnablePackageMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
  const pkgHash = message.args?.[ARG_INDEX_PKG_HASH] || "-";
  const pkgHeight = message.args?.[ARG_INDEX_PKG_HEIGHT] || "-";

  return (
    <>
      <Field label="Type" isDesktop={isDesktop}>
        <BadgeText>{message.messageType}</BadgeText>
      </Field>

      <Field label="Function" isDesktop={isDesktop}>
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message) || "-"}
        </BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <PkgPathLink path={message.pkgPath || "-"} getUrlWithNetwork={getUrlWithNetwork} isEllipsis={false} />
      </FieldWithTooltip>

      <Field label="Approver" isDesktop={isDesktop}>
        <AddressLink
          address={message.caller || ""}
          addressName={message.callerName}
          copyText={message.caller || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.callerLabel}
          labelType={message.callerLabelType}
        />
      </Field>

      <Field label="Pkg Hash" isDesktop={isDesktop}>
        <BadgeText>{pkgHash}</BadgeText>
      </Field>

      <Field label="Pkg Height" isDesktop={isDesktop}>
        <BadgeText>{pkgHeight}</BadgeText>
      </Field>
    </>
  );
};

export default StandardNetworkEnablePackageMessage;
