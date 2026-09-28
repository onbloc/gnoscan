import React from "react";
import styled from "styled-components";

import Tooltip from "@/components/ui/tooltip";
import theme from "@/styles/theme";

interface Props {
  attributes: { key: string; value: string }[];
}

/** Events tab "Attributes" column: one-line key=value summary; full list on hover. */
export const EventAttributes = ({ attributes }: Props) => {
  if (!attributes.length) return <span>-</span>;

  const summary = attributes.map(attribute => `${attribute.key}=${attribute.value}`).join(", ");

  const renderTooltip = () => (
    <TooltipWrapper>
      {attributes.map((attribute, index) => (
        <span key={index}>
          <span className="key">{attribute.key}</span>
          {`: ${attribute.value}`}
        </span>
      ))}
    </TooltipWrapper>
  );

  return (
    <Tooltip className="ellipsis" content={renderTooltip()}>
      <SummaryText className="ellipsis">{summary}</SummaryText>
    </Tooltip>
  );
};

const SummaryText = styled.span`
  & {
    display: block;
    width: 100%;
    ${theme.fonts.p4};
    color: ${({ theme }) => theme.colors.eventParam};
  }
`;

const TooltipWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    ${theme.fonts.p4};
    word-break: break-all;

    .key {
      color: ${({ theme }) => theme.colors.tertiary};
    }
  }
`;
