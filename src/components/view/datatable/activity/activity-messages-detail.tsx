import React from "react";

import { ActivityMessage } from "@/models/api/activity/activity-model";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ActivityDetailWrapper } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  messages: ActivityMessage[];
}

/** Direct Transactions row expansion: index/type/function/argument summary per message. */
export const ActivityMessagesDetail = ({ visible, messages }: Props) => {
  return (
    <ActivityDetailWrapper className={visible ? "active" : "hidden"}>
      {visible && (
        <div className="container">
          {messages.length === 0 && <span className="empty">No messages</span>}
          {messages.map(message => (
            <div className="entry" key={message.index}>
              <div className="entry-row">
                <span className="entry-label">{`#${message.index}`}</span>
                <span className="badge">{message.messageType}</span>
                <span>{message.funcType}</span>
              </div>
              {message.pkgPath && (
                <div className="entry-row">
                  <span className="entry-label">Package</span>
                  <span>{stripGnoLandPrefix(message.pkgPath)}</span>
                </div>
              )}
              {message.args.length > 0 && (
                <div className="entry-row">
                  <span className="entry-label">Args</span>
                  <span>{message.args.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ActivityDetailWrapper>
  );
};
