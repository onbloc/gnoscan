import React from "react";

import { GNO_TOKEN_RESOURCE_URL } from "@/common/values/constant-value";

import IconLink from "@/assets/svgs/icon-link.svg";
import { LinkWrapper } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
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
      <LinkWrapper href={GNO_TOKEN_RESOURCE_URL} target="_blank" rel="noreferrer">
        <Text type="p4">Add in Gno.land Token Resources</Text>
        <IconLink className="icon-link" />
      </LinkWrapper>
    )}
  </Field>
);
