import { getTransactionMessageType } from "@/common/utils/message.utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { AddressLink, BadgeText, Field } from "@/components/ui/detail-field";

const StandardNetworkRevokeSessionMessage = ({ message, getUrlWithNetwork }: TransactionContractMessagesProps) => {
  const session = message.session;

  // Both `revoke_session` and `revoke_all_sessions` share this card; the
  // message type is taken from the API response so the correct badge is shown.
  const isRevokeAllSessions = message.messageType === MESSAGE_TYPES.AUTH_REVOKE_ALL_SESSIONS;

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

      {!isRevokeAllSessions && (
        <Field label="Session Key">
          <BadgeText>{session?.sessionKey || "-"}</BadgeText>
        </Field>
      )}
    </>
  );
};

export default StandardNetworkRevokeSessionMessage;
