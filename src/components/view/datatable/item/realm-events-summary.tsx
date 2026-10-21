import React from "react";
import styled from "styled-components";

import Tooltip from "@/components/ui/tooltip";
import Text from "@/components/ui/text";
import theme from "@/styles/theme";
import { ActivityEvent } from "@/models/api/activity/activity-model";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";

interface Props {
  events: ActivityEvent[];
}

/**
 * Internal Transactions "Realm Events" column: first event's type + a "+N" badge for the rest.
 * Hovering anywhere on the cell lists every event type (with its package) in event order.
 */
export const RealmEventsSummary = ({ events }: Props) => {
  if (!events.length) return <span>-</span>;

  const [first, ...rest] = events;

  const renderTooltip = () => (
    <TooltipWrapper>
      {events.map((event, index) => (
        <div className="event-item" key={`${event.eventIndex}-${index}`}>
          <span className="title">{event.eventType}</span>
          {event.packagePath && <span className="info">{stripGnoLandPrefix(event.packagePath)}</span>}
        </div>
      ))}
    </TooltipWrapper>
  );

  return (
    <SummaryWrapper>
      <Tooltip className={"ellipsis"} content={renderTooltip()}>
        <span className="event ellipsis">{first.eventType}</span>
        {rest.length > 0 && (
          <Text className="rest-count" type="p4" color="reverse" margin="0px 0px 0px 8px">
            {`+${rest.length}`}
          </Text>
        )}
      </Tooltip>
    </SummaryWrapper>
  );
};

const SummaryWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    max-width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    .event {
      display: block;
      width: 100%;
      min-width: 0;
      padding: 4px 16px;
      color: #fff;
      background-color: ${({ theme }) => theme.colors.blue};
      border-radius: 4px;
    }

    .rest-count {
      flex-shrink: 0;
      white-space: nowrap;
    }
  }
`;

const TooltipWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .event-item {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    span {
      display: flex;
      width: 100%;
      ${theme.fonts.p4};
      justify-content: flex-start;
      align-items: center;
    }

    .title {
      color: ${({ theme }) => theme.colors.primary};
    }

    .info {
      width: 100%;
      height: fit-content;
      padding: 6px 10px;
      margin-top: 4px;
      color: ${({ theme }) => theme.colors.reverse};
      background-color: ${({ theme }) => theme.colors.pantone};
      border-radius: 4px;
    }
  }
`;
