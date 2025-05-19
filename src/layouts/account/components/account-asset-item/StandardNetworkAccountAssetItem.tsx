import React from "react";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { Amount } from "@/types/data-type";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAssetItem.styles";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { AccountAssetTokenInfo } from "@/repositories/api/account/response";
import { makeDisplayTokenAmount } from "@/common/utils/string-util";

interface AccountAssetItemProps {
  assetToken: AccountAssetTokenInfo;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  isFetched: boolean;
}

const StandardNetworkAccountAssetItem = ({ assetToken, breakpoint, isDesktop, isFetched }: AccountAssetItemProps) => {
  const { getTokenInfo } = useTokenMeta();

  const assetTokenImage = React.useMemo(() => {
    return assetToken?.logoUrl ? (
      <img src={assetToken.logoUrl} alt={`${assetToken.symbol}-image`} />
    ) : (
      <UnknownToken aria-label="Unknown token image" width="40" height="40" />
    );
  }, [assetToken.logoUrl]);

  const assetTokenAmount: Amount = React.useMemo(() => {
    if (!assetToken?.amount) return { value: "0", denom: assetToken.symbol };

    const formattedAmount = makeDisplayTokenAmount(assetToken.amount, assetToken.decimals || 6, {
      hideDecimals: true,
    });

    return {
      value: formattedAmount,
      denom: assetToken.symbol,
    };
  }, [assetToken?.amount, assetToken?.decimals, assetToken?.symbol]);

  if (!isFetched) {
    return (
      <S.Box key={`token-asset-${assetToken.symbol}:${assetToken.packagePath}`} breakpoint={breakpoint}>
        <S.TokenInfo>
          <S.LogoWrapper>
            <UnknownToken aria-label="Loading TokenImage" width="40" height="40" />
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
    <S.Box key={`token-asset-${assetToken.symbol}`} breakpoint={breakpoint}>
      <S.TokenInfo>
        <S.LogoWrapper>{assetTokenImage}</S.LogoWrapper>

        <S.TokenName type={isDesktop ? "p3" : "p4"} color="primary">
          {getTokenInfo(assetToken.symbol)?.name || ""}
        </S.TokenName>
      </S.TokenInfo>

      <AmountText minSize="p4" maxSize="p3" {...assetTokenAmount} />
    </S.Box>
  );
};

export default StandardNetworkAccountAssetItem;
