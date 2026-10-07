import React from "react";

import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { AccountVestingModel } from "@/repositories/api/account/response";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { AmountText } from "@/components/ui/text/amount-text";
import Text from "@/components/ui/text";

import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import IconChevron from "@/assets/svgs/icon-chevron.svg";
import { resolveAccountAssetLogoUrl } from "@/layouts/account/components/account-asset-item/account-asset-item.utility";
import * as S from "./AccountVestingAsset.styles";

interface AccountVestingAssetProps {
  vesting: AccountVestingModel;
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
}

const formatEndDate = (endTime: string) => {
  const date = new Date(endTime);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const AccountVestingAsset = ({ vesting, breakpoint, isDesktop }: AccountVestingAssetProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { getTokenAmount, getTokenImage, getTokenInfo } = useTokenMeta();
  const token = getTokenInfo(GNOTToken.denom);
  const logoUrl = resolveAccountAssetLogoUrl(undefined, GNOTToken.denom, getTokenImage);
  const total = getTokenAmount(GNOTToken.denom, vesting.total);
  const available = getTokenAmount(GNOTToken.denom, vesting.available);
  const originalVesting = getTokenAmount(GNOTToken.denom, vesting.originalVesting);
  const locked = getTokenAmount(GNOTToken.denom, vesting.locked);
  const progress = Math.min(100, Math.max(0, vesting.progress * 100));

  return (
    <S.Box breakpoint={breakpoint}>
      <S.HeaderButton
        type="button"
        aria-expanded={isExpanded}
        aria-label={`${token.name} vesting details`}
        onClick={() => setIsExpanded(expanded => !expanded)}
      >
        <S.TokenInfo>
          <S.LogoWrapper>
            {logoUrl ? (
              <img src={logoUrl} alt={`${GNOTToken.symbol}-token-image`} />
            ) : (
              <UnknownToken aria-label="Unknown token image" width="40" height="40" />
            )}
          </S.LogoWrapper>
          <Text type={isDesktop ? "p3" : "p4"} color="primary">
            {token.name}
          </Text>
        </S.TokenInfo>
        <S.Balance>
          <AmountText minSize="p4" maxSize="p3" color="tertiary" {...total} wrap={false} />
          <S.Chevron $isExpanded={isExpanded}>
            <IconChevron />
          </S.Chevron>
        </S.Balance>
      </S.HeaderButton>

      {isExpanded && (
        <>
          <S.Divider />
          <S.Details>
            <VestingRow label="Spendable" amount={available} />
            <VestingRow label="Total Vesting Amount" amount={originalVesting} />
            <VestingRow label="Locked · Vesting" amount={locked} />
          </S.Details>
          <S.ProgressTrack aria-label={`${progress.toFixed(1)}% vested`}>
            <S.ProgressValue $progress={progress} />
          </S.ProgressTrack>
          <S.ProgressSummary>
            <Text type="body1" color="tertiary">
              Vested until {formatEndDate(vesting.endTime)}
            </Text>
            <Text type="body1" color="green">
              {progress.toFixed(1)}% Vested
            </Text>
          </S.ProgressSummary>
        </>
      )}
    </S.Box>
  );
};

const VestingRow = ({ label, amount }: { label: string; amount: { value: string; denom: string } }) => (
  <S.DetailRow>
    <Text type="p4" color="tertiary">
      {label}
    </Text>
    <AmountText minSize="body1" maxSize="p4" {...amount} wrap={false} />
  </S.DetailRow>
);

export default AccountVestingAsset;
