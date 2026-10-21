import React from "react";
import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { Field } from "./DetailField";

// BadgeText breaks anywhere for hashes and addresses, so prose wraps at spaces here instead.
const descriptionTextStyle: React.CSSProperties = { whiteSpace: "normal", overflowWrap: "anywhere" };

// The last summary row drops its bottom padding. A multi line description reads cramped against
// the source viewer without it, so this row keeps the regular row padding.
const DescriptionRow = styled(Field)`
  &&:last-of-type {
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
      <Badge style={{ marginRight: 0 }}>
        <Text type="p4" color="primary" style={descriptionTextStyle}>
          {description}
        </Text>
      </Badge>
    ) : (
      <TokenResourceLink label="Add in Gno.land Token Resources" />
    )}
  </DescriptionRow>
);
