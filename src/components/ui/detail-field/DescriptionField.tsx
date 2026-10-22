import React from "react";
import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { Field } from "./DetailField";

// The token page layout gives every badge an inline flex box with a fixed 28px height, and whether
// that beats the summary row's auto height depends on styled components rule order. Inline styles
// win either way, so wrapped text grows the box instead of spilling out of it.
// The padding gives multi line text the same breathing room as single line badges.
const descriptionBadgeStyle: React.CSSProperties = {
  display: "block",
  height: "auto",
  padding: "12px 16px",
  marginRight: 0,
};
// BadgeText breaks anywhere for hashes and addresses, so prose wraps at spaces here instead.
const descriptionTextStyle: React.CSSProperties = { whiteSpace: "normal", overflowWrap: "anywhere" };

// The last summary row drops its bottom padding. A multi line description reads cramped against
// the source viewer without it, so this row keeps the regular row padding while the viewer follows.
const DescriptionRow = styled(Field)`
  &&:last-of-type:not(:last-child) {
    padding-bottom: 12px;

    ${media.DESKTOP} {
      padding-bottom: 18px;
    }
  }
`;

interface DescriptionFieldProps {
  description?: string;
}

// Shows the gno-token-resource description, or a link to add one when the resource has none.
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ description }) => (
  <DescriptionRow label="Description">
    {description?.trim() ? (
      <Badge style={descriptionBadgeStyle}>
        <Text type="p4" color="primary" style={descriptionTextStyle}>
          {description}
        </Text>
      </Badge>
    ) : (
      <TokenResourceLink label="Add in Gno.land Token Resources" />
    )}
  </DescriptionRow>
);
