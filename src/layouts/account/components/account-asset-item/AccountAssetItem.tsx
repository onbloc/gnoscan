import React from "react";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { Amount } from "@/types/data-type";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAssetItem.styles";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";

interface AccountAssetItemProps {
  amount: Amount;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
}

const AccountAssetItem = ({ amount, breakpoint, isDesktop }: AccountAssetItemProps) => {
  const { getTokenImage, getTokenAmount, getTokenInfo } = useTokenMeta();

  const tokenImage = React.useMemo(() => {
    return getTokenImage(amount.denom) ? (
      <img src={getTokenImage(amount.denom)} alt={`${amount.denom}-image`} />
    ) : (
      <UnknownToken aria-label="Unknown token image" width="40" height="40" />
    );
  }, [getTokenImage, amount.denom]);

  return (
    <S.Box key={`token-asset-${amount.denom}`} breakpoint={breakpoint}>
      <S.TokenInfo>
        <S.LogoWrapper>{tokenImage}</S.LogoWrapper>

        <S.TokenName type={isDesktop ? "p3" : "p4"} color="primary">
          {getTokenInfo(amount.denom)?.name || ""}
        </S.TokenName>
      </S.TokenInfo>

      <AmountText minSize="p4" maxSize="p3" {...getTokenAmount(amount.denom, amount.value)} />
    </S.Box>
  );
};

export default AccountAssetItem;
