import React from "react";
import styled from "styled-components";

import Tooltip from "@/components/ui/tooltip";
import theme from "@/styles/theme";

interface TooltipLine {
  key?: string;
  value: string;
}

interface TruncatedTextProps {
  text: string;
  lines: TooltipLine[];
}

/** One-line text truncated at the cell edge; the full lines show on hover. */
export const TruncatedText = ({ text, lines }: TruncatedTextProps) => {
  if (!text) return <span>-</span>;

  const renderTooltip = () => (
    <TooltipWrapper>
      {lines.map((line, index) => (
        <span key={index}>
          {line.key !== undefined && <span className="key">{`${line.key}: `}</span>}
          {line.value}
        </span>
      ))}
    </TooltipWrapper>
  );

  return (
    <TruncatedCell>
      <Tooltip className="ellipsis truncated-trigger" content={renderTooltip()}>
        <SummaryText className="ellipsis">{text}</SummaryText>
      </Tooltip>
    </TruncatedCell>
  );
};

interface Props {
  attributes: { key: string; value: string }[];
}

/** Events tab "Attributes" column: one-line key=value summary; full list on hover. */
export const EventAttributes = ({ attributes }: Props) => (
  <TruncatedText
    text={attributes.map(attribute => `${attribute.key}=${attribute.value}`).join(", ")}
    lines={attributes}
  />
);

// Bound the tooltip trigger to the cell width so the text truncates at the column edge.
const TruncatedCell = styled.div`
  & {
    display: flex;
    width: 100%;
    min-width: 0;

    .truncated-trigger {
      width: 100%;
      min-width: 0;
    }

    .truncated-trigger .tooltip-button {
      justify-content: flex-start;
      min-width: 0;
    }
  }
`;

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
