import { getTransactionMessageType } from "@/common/utils/message.utility";
import { TOOLTIP_PACKAGE_PATH } from "@/common/values/tooltip-content.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { AddressLink, BadgeText, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { PkgPathLink } from "@/components/view/transaction/common";

const StandardNetworkRejectPackageMessage = ({ message, getUrlWithNetwork }: TransactionContractMessagesProps) => {
  return (
    <>
      <Field label="Type">
        <BadgeText>{message.messageType}</BadgeText>
      </Field>

      <Field label="Function">
        <BadgeText type="blue" color="white">
          {getTransactionMessageType(message) || "-"}
        </BadgeText>
      </Field>

      <FieldWithTooltip label="Pkg Path" tooltipContent={TOOLTIP_PACKAGE_PATH}>
        <PkgPathLink path={message.pkgPath || "-"} getUrlWithNetwork={getUrlWithNetwork} isEllipsis={false} />
      </FieldWithTooltip>

      <Field label="Sender">
        <AddressLink
          address={message.caller || ""}
          addressName={message.callerName}
          copyText={message.caller || ""}
          getUrlWithNetwork={getUrlWithNetwork}
          label={message.callerLabel}
          labelType={message.callerLabelType}
        />
      </Field>
    </>
  );
};

export default StandardNetworkRejectPackageMessage;
