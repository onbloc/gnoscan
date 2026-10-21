import React from "react";

import * as S from "./AccountAddress.styles";

const AccountAddressSkeleton = () => {
  return (
    <S.Card>
      <S.SkeletonBox width={"30%"} height={14} marginBottom={10} />
      <S.SkeletonBox width={"20%"} height={14} />
      <S.SkeletonBox width={"50%"} height={14} />
    </S.Card>
  );
};

export default AccountAddressSkeleton;
