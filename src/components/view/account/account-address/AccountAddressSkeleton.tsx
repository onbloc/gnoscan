import React from "react";
import styled from "styled-components";

import * as S from "./AccountAddress.styles";
import { SkeletonBoxStyle } from "@/components/ui/loading";
import mixins from "@/styles/mixins";

const SkeletonBox = styled(SkeletonBoxStyle)<{
  width?: string;
  marginTop?: number;
  marginBottom?: number;
  height?: number;
}>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: ${({ width }) => width ?? "100%"};
  margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : "0")};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "28px")};
`;

interface AccountAddressSkeletonProps {
  isDesktop: boolean;
}

const AccountAddressSkeleton = ({ isDesktop }: AccountAddressSkeletonProps) => {
  return (
    <S.Card isDesktop={isDesktop}>
      <SkeletonBox width={"30%"} height={14} marginBottom={10} />
      <SkeletonBox width={"20%"} height={14} />
      <SkeletonBox width={"50%"} height={14} />
    </S.Card>
  );
};

export default AccountAddressSkeleton;
