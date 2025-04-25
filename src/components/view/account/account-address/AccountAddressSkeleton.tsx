import React from "react";

import * as S from "./AccountAddress.styles";

interface AccountAddressSkeletonProps {
  isDesktop: boolean;
}

const AccountAddressSkeleton = ({ isDesktop }: AccountAddressSkeletonProps) => {
  return (
    <S.Card isDesktop={isDesktop}>
      <S.SkeletonBox width={"30%"} height={14} marginBottom={10} />
      <S.SkeletonBox width={"20%"} height={14} />
      <S.SkeletonBox width={"50%"} height={14} />
    </S.Card>
  );
};

export default AccountAddressSkeleton;
