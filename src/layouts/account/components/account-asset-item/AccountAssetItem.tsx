import React from "react";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { Amount } from "@/types/data-type";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { useNetwork } from "@/common/hooks/use-network";
import { GNO_NETWORK_PREFIXES } from "@/common/values/gno.constant";
import { formatDisplayTokenPath } from "@/common/utils/token.utility";

import * as S from "./AccountAssetItem.styles";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { NonMobile } from "@/common/hooks/use-media";
import { LinkWrapper } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
import IconLink from "@/assets/svgs/icon-link.svg";

interface AccountAssetItemProps {
  amount: Amount;
  logoUrl?: string | null;
  tokenPath?: string;
  showTokenPathLink?: boolean;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  isFetched: boolean;
}

const AccountAssetItem = ({
  amount,
  logoUrl,
  tokenPath,
  showTokenPathLink,
  breakpoint,
  isDesktop,
  isFetched,
}: AccountAssetItemProps) => {
  const { getTokenImage, getTokenAmount, getTokenInfo } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();

  const tokenLogoUrl = React.useMemo(() => {
    return logoUrl || getTokenImage(amount.denom) || "";
  }, [logoUrl, amount.denom]);

  const tokenLogoImage = React.useMemo(() => {
    if (tokenLogoUrl) return <img src={tokenLogoUrl} alt={`${amount.denom}-token-image`} />;

    return <UnknownToken aria-label="Unknown token image" width="40" height="40" />;
  }, [tokenLogoUrl, getTokenImage, amount.denom]);

  const shouldShowTokenPathLink = React.useMemo(() => {
    return showTokenPathLink && tokenPath;
  }, [showTokenPathLink, tokenPath]);

  const displayTokenPath = React.useMemo(() => {
    if (!tokenPath) return null;
    return formatDisplayTokenPath(tokenPath.replace(GNO_NETWORK_PREFIXES.GNO_LAND, ""));
  }, [tokenPath]);

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
          {shouldShowTokenPathLink && (
            <NonMobile>
              <LinkWrapper target="_blank" href={getUrlWithNetwork(`/tokens/${tokenPath}`)}>
                <Text type="p4" style={{ fontSize: 12 }} className="ellipsis">
                  {displayTokenPath}
                </Text>
                <IconLink className="icon-link" />
              </LinkWrapper>
            </NonMobile>
          )}
        </S.TokenName>
      </S.TokenInfo>

      <AmountText minSize="p4" maxSize="p3" {...getTokenAmount(amount.denom, amount.value)} />
    </S.Box>
  );
};

export default AccountAssetItem;
