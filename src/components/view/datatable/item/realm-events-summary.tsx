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

/** Internal Transactions "Realm Events" column: first event's type + a "+N" badge for the rest. */
export const RealmEventsSummary = ({ events }: Props) => {
  if (!events.length) return <span>-</span>;

  const [first, ...rest] = events;

  const renderTooltip = () => (
    <TooltipWrapper>
      <span className="title">{first.eventType}</span>
      {first.packagePath && <span className="info">{stripGnoLandPrefix(first.packagePath)}</span>}
    </TooltipWrapper>
  );

  return (
    <SummaryWrapper>
      <Tooltip className={"ellipsis"} content={renderTooltip()}>
        <span className="event ellipsis">{first.eventType}</span>
      </Tooltip>
      {rest.length > 0 && (
        <Text type="p4" color="reverse" margin="0px 0px 0px 8px">
          {`+${rest.length}`}
        </Text>
      )}
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
      padding: 4px 16px;
      color: #fff;
      background-color: ${({ theme }) => theme.colors.blue};
      border-radius: 4px;
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
