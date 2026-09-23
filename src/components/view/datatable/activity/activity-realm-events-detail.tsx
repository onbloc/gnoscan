import React from "react";

import { ActivityEvent } from "@/models/api/activity/activity-model";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ActivityDetailWrapper } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  events: ActivityEvent[];
}

/** Internal Transactions row expansion: every own-realm event raised by the tx, in event-index order. */
export const ActivityRealmEventsDetail = ({ visible, events }: Props) => {
  return (
    <ActivityDetailWrapper className={visible ? "active" : "hidden"}>
      {visible && (
        <div className="container">
          {events.length === 0 && <span className="empty">No realm events</span>}
          {events.map(event => (
            <div className="entry" key={event.eventIndex}>
              <div className="entry-row">
                <span className="entry-label">{`#${event.eventIndex}`}</span>
                <span className="badge">{event.eventType}</span>
                <span>{stripGnoLandPrefix(event.packagePath)}</span>
              </div>
              {event.attributes.length > 0 && (
                <div className="attributes">
                  {event.attributes.map((attribute, index) => (
                    <div className="attribute-row" key={index}>
                      <span className="key">{attribute.key}</span>
                      <span className="value">{attribute.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ActivityDetailWrapper>
  );
};
