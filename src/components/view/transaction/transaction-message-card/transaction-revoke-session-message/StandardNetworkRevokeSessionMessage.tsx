import { getTransactionMessageType } from "@/common/utils/message.utility";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractMessagesProps } from "@/models/api/transaction";

import { AddressLink, BadgeText, Field } from "@/components/view/transaction/common";

const StandardNetworkRevokeSessionMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionContractMessagesProps) => {
  const session = message.session;

  // Both `revoke_session` and `revoke_all_sessions` share this card; the
  // message type is taken from the API response so the correct badge is shown.
  const isRevokeAllSessions = message.messageType === MESSAGE_TYPES.AUTH_REVOKE_ALL_SESSIONS;

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

      <Field label="Creator" isDesktop={isDesktop}>
        <AddressLink
          address={message.creator || ""}
          addressName={message.creatorName}
          copyText={message.creator || ""}
          getUrlWithNetwork={getUrlWithNetwork}
        />
      </Field>

      {!isRevokeAllSessions && (
        <Field label="Session Key" isDesktop={isDesktop}>
          <BadgeText>{session?.sessionKey || "-"}</BadgeText>
        </Field>
      )}
    </>
  );
};

export default StandardNetworkRevokeSessionMessage;
