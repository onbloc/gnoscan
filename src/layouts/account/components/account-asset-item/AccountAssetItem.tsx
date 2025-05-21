import React from "react";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { Amount } from "@/types/data-type";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAssetItem.styles";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

interface AccountAssetItemProps {
  amount: Amount;
  logoUrl?: string | null;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  isFetched: boolean;
}

const AccountAssetItem = ({ amount, logoUrl, breakpoint, isDesktop, isFetched }: AccountAssetItemProps) => {
  const { getTokenImage, getTokenAmount, getTokenInfo } = useTokenMeta();

  const tokenLogoUrl = React.useMemo(() => {
    return logoUrl || getTokenImage(amount.denom) || "";
  }, [logoUrl, amount.denom]);

  const tokenLogoImage = React.useMemo(() => {
    if (tokenLogoUrl) return <img src={tokenLogoUrl} alt={`${amount.denom}-token-image`} />;

    return <UnknownToken aria-label="Unknown token image" width="40" height="40" />;
  }, [tokenLogoUrl, getTokenImage, amount.denom]);

  if (!isFetched) {
    return (
      <S.Box key={`token-asset-${amount.denom}`} breakpoint={breakpoint}>
        <S.TokenInfo>
          <S.LogoWrapper>
            <SkeletonBar aria-label="Loading TokenImage" width={40} height={40} borderRadius={"100%"} />
          </S.LogoWrapper>

          <S.TokenName type={isDesktop ? "p3" : "p4"} color="primary">
            <SkeletonBar width="100%" height={20} />
          </S.TokenName>
        </S.TokenInfo>

        <SkeletonBar width="50%" height={20} />
      </S.Box>
    );
  }

  return (
    <S.Box key={`token-asset-${amount.denom}`} breakpoint={breakpoint}>
      <S.TokenInfo>
        <S.LogoWrapper>{tokenLogoImage}</S.LogoWrapper>

        <S.TokenName type={isDesktop ? "p3" : "p4"} color="primary">
          {getTokenInfo(amount.denom)?.name || ""}
        </S.TokenName>
      </S.TokenInfo>

      <AmountText minSize="p4" maxSize="p3" {...getTokenAmount(amount.denom, amount.value)} />
    </S.Box>
  );
};

export default AccountAssetItem;
