import React from "react";

import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { BadgeText, Field } from "./DetailField";

interface DescriptionFieldProps {
  description?: string;
}

// Shows the gno-token-resource description, or a link to add one when the resource has none.
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ description }) => (
  <Field label="Description">
    {description?.trim() ? (
      <BadgeText>{description}</BadgeText>
    ) : (
      <TokenResourceLink label="Add in Gno.land Token Resources" />
    )}
  </Field>
);
