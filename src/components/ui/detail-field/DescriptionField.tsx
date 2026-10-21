import React from "react";

import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { Field } from "./DetailField";

// BadgeText breaks anywhere for hashes and addresses, so prose wraps at spaces here instead.
const descriptionTextStyle: React.CSSProperties = { whiteSpace: "normal", overflowWrap: "anywhere" };

interface DescriptionFieldProps {
  description?: string;
}

// Shows the gno-token-resource description, or a link to add one when the resource has none.
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ description }) => (
  <Field label="Description">
    {description?.trim() ? (
      <Badge style={{ marginRight: 0 }}>
        <Text type="p4" color="primary" style={descriptionTextStyle}>
          {description}
        </Text>
      </Badge>
    ) : (
      <TokenResourceLink label="Add in Gno.land Token Resources" />
    )}
  </Field>
);
