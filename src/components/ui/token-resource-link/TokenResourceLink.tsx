import React from "react";

import { GNO_TOKEN_RESOURCE_URL } from "@/common/values/constant-value";

import IconLink from "@/assets/svgs/icon-link.svg";
import Text from "@/components/ui/text";
import * as S from "./TokenResourceLink.styles";

interface TokenResourceLinkProps {
  label: string;
}

const TokenResourceLink = ({ label }: TokenResourceLinkProps) => (
  <S.Link href={GNO_TOKEN_RESOURCE_URL} target="_blank" rel="noreferrer">
    <Text type="p4" className="ellipsis">
      {label}
    </Text>
    <IconLink className="icon-link" />
  </S.Link>
);

export default TokenResourceLink;
