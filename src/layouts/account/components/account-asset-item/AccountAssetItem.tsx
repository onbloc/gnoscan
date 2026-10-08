import React from "react";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { Amount } from "@/types/data-type";
import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayTokenPath, stripGnoLandPrefix } from "@/common/utils/token.utility";
import { resolveAccountAssetLogoUrl } from "./account-asset-item.utility";

import * as S from "./AccountAssetItem.styles";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { LinkWrapper } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
import IconLink from "@/assets/svgs/icon-link.svg";

interface AccountAssetItemProps {
  amount: Amount;
  name?: string;
  logoUrl?: string | null;
  tokenPath?: string;
  // Price lookup key when amount.denom is a display symbol rather than the token key (e.g. tokenId).
  priceTokenKey?: string;
  showTokenPathLink?: boolean;
  isDesktop: boolean;
  isFetched: boolean;
}

const AccountAssetItem = ({
  amount,
  name,
  logoUrl,
  tokenPath,
  priceTokenKey,
  showTokenPathLink,
  isDesktop,
  isFetched,
}: AccountAssetItemProps) => {
  const { getTokenImage, getTokenAmount, getTokenInfo } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();
  const { getUsdDisplay, isLoading: isLoadingPrice } = useTokenPrice();

  const tokenLogoUrl = React.useMemo(() => {
    return resolveAccountAssetLogoUrl(logoUrl, amount.denom, getTokenImage);
  }, [logoUrl, amount.denom, getTokenImage]);

  const tokenLogoImage = React.useMemo(() => {
    if (tokenLogoUrl) return <img src={tokenLogoUrl} alt={`${amount.denom}-token-image`} />;

    return <UnknownToken aria-label="Unknown token image" width="40" height="40" />;
  }, [tokenLogoUrl, amount.denom]);

  const shouldShowTokenPathLink = React.useMemo(() => {
    return showTokenPathLink && tokenPath;
  }, [showTokenPathLink, tokenPath]);

  const displayTokenPath = React.useMemo(() => {
    if (!tokenPath) return null;
    return formatDisplayTokenPath(stripGnoLandPrefix(tokenPath));
  }, [tokenPath]);

  const tokenKey = React.useMemo(() => {
    if (!tokenPath) return tokenPath;
    return amount.denom ? `${tokenPath}.${amount.denom}` : tokenPath;
  }, [tokenPath, amount.denom]);
  // amount.value is in base units for denom-keyed assets (e.g. ugnot); price the display amount.
  const tokenAmount = getTokenAmount(amount.denom, amount.value);
  const usdValue = getUsdDisplay(priceTokenKey || amount.denom, tokenAmount.value);

  if (!isFetched) {
    return (
      <S.Box key={`token-asset-${amount.denom}`}>
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
    <S.Box key={`token-asset-${amount.denom}`}>
      <S.TokenInfo>
        <S.LogoWrapper>{tokenLogoImage}</S.LogoWrapper>

        <S.TokenName type={isDesktop ? "p3" : "p4"} color="primary">
          {name || getTokenInfo(amount.denom)?.name || ""}
          {shouldShowTokenPathLink && (
            <LinkWrapper className="hide-mobile" target="_blank" href={getUrlWithNetwork(`/tokens/${tokenKey}`)}>
              <Text type="p4" style={{ fontSize: 12 }} className="ellipsis">
                {displayTokenPath}
              </Text>
              <IconLink className="icon-link" />
            </LinkWrapper>
          )}
        </S.TokenName>
      </S.TokenInfo>
      <S.AmountInfo>
        {isLoadingPrice ? (
          <SkeletonBar width={80} height={20} />
        ) : (
          <Text type={isDesktop ? "p3" : "p4"} color="primary">
            {usdValue || "-"}
          </Text>
        )}
        <AmountText minSize="body1" maxSize="p4" {...tokenAmount} />
      </S.AmountInfo>
    </S.Box>
  );
};

export default AccountAssetItem;
