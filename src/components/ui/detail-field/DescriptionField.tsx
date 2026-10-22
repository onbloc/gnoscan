import React from "react";

import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { Field } from "./DetailField";

// The token page layout gives every badge an inline flex box with a fixed 28px height, and whether
// that beats the summary row's auto height depends on styled components rule order. Inline styles
// win either way, so wrapped text grows the box instead of spilling out of it.
const descriptionBadgeStyle: React.CSSProperties = { display: "block", height: "auto", marginRight: 0 };
// BadgeText breaks anywhere for hashes and addresses, so prose wraps at spaces here instead.
const descriptionTextStyle: React.CSSProperties = { whiteSpace: "normal", overflowWrap: "anywhere" };

interface DescriptionFieldProps {
  description?: string;
}

// Shows the gno-token-resource description, or a link to add one when the resource has none.
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ description }) => (
  // top-aligned keeps the label on the first line when the description wraps.
  <Field label="Description" className="top-aligned">
    {description?.trim() ? (
      <Badge style={descriptionBadgeStyle}>
        <Text type="p4" color="primary" style={descriptionTextStyle}>
          {description}
        </Text>
      </Badge>
    ) : (
      <TokenResourceLink label="Add in Gno.land Token Resources" />
    )}
  </Field>
);
