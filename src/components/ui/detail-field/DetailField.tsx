import React, { CSSProperties } from "react";
import BigNumber from "bignumber.js";
import Link from "next/link";

import { scrollbarStyle } from "@/common/hooks/use-scroll-bar";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { getAddressDisplayText, getAddressLinkPath } from "@/common/utils/address-label.utility";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { PaletteKeyType } from "@/styles";
import { Amount } from "@/types/data-type";

import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import Badge from "@/components/ui/badge";
import { DLWrap, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import { StorageDepositText } from "@/components/ui/text/storage-deposit-text";
import { UsdValueText } from "@/components/ui/text/usd-value-text";
import Tooltip from "@/components/ui/tooltip";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import * as S from "./DetailField.styles";

interface FieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  isDesktop: boolean;
  className?: string;
  contentClassName?: string;
  multipleBadgeGap?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  children,
  isDesktop,
  className,
  contentClassName,
  multipleBadgeGap,
}) => (
  <DLWrap desktop={isDesktop} className={className} multipleBadgeGap={multipleBadgeGap}>
    <dt>{label}</dt>
    <dd className={contentClassName}>{children}</dd>
  </DLWrap>
);

interface FieldWithTooltipProps extends FieldProps {
  tooltipContent: React.ReactNode | string;
}

export const FieldWithTooltip: React.FC<FieldWithTooltipProps> = ({
  label,
  tooltipContent,
  children,
  isDesktop,
  className,
  contentClassName,
  multipleBadgeGap,
}) => (
  <DLWrap desktop={isDesktop} className={className} multipleBadgeGap={multipleBadgeGap}>
    <dt>
      {label}
      <div className="tooltip-wrapper">
        <Tooltip content={tooltipContent}>
          <IconTooltip />
        </Tooltip>
      </div>
    </dt>
    <dd className={contentClassName}>{children}</dd>
  </DLWrap>
);

interface BadgeTextProps {
  type?: PaletteKeyType;
  color?: string;
  children: React.ReactNode;
}

const badgeStyles: CSSProperties = {
  wordBreak: "break-all",
  maxHeight: 300,
  overflow: "auto",
  marginRight: 0,
};

const badgeTextStyles: CSSProperties = {
  whiteSpace: "normal",
  height: "100%",
};

export const BadgeText: React.FC<BadgeTextProps> = ({ type, color = "primary", children }) => (
  <Badge type={type} style={badgeStyles} cssExtend={scrollbarStyle}>
    <Text type="p4" color={color || "primary"} style={badgeTextStyles}>
      {children}
    </Text>
  </Badge>
);

interface AddressLinkProps {
  address: string;
  addressName: string;
  copyText: string;
  getUrlWithNetwork: (uri: string) => string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

export const AddressLink: React.FC<AddressLinkProps> = ({
  address,
  addressName,
  copyText,
  getUrlWithNetwork,
  label,
  labelType,
}) => {
  const displayAccount = React.useMemo(() => {
    if (!address) return "-";
    return getAddressDisplayText({ address, name: addressName, label });
  }, [address, addressName, label]);

  return (
    <Badge>
      <S.AddressTextBox>
        <Text type="p4" color="blue" className="ellipsis">
          <Link href={getUrlWithNetwork(getAddressLinkPath({ address, name: addressName, label, labelType }))} passHref>
            <FitContentSpan>{displayAccount}</FitContentSpan>
          </Link>
        </Text>
        <CopyTooltip variant="address" copyText={copyText} />
      </S.AddressTextBox>
    </Badge>
  );
};

interface AddressDisplayLinkProps {
  address?: string | null;
  name?: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  getUrlWithNetwork: (uri: string) => string;
}

/** Linked owner or publisher text inside a summary badge. */
export const AddressDisplayLink: React.FC<AddressDisplayLinkProps> = ({
  address,
  name,
  label,
  labelType,
  getUrlWithNetwork,
}) => (
  <FitContentSpan>
    <Link href={getUrlWithNetwork(getAddressLinkPath({ address, name, label, labelType }))} passHref>
      <Text type="p4" color="blue" className="ellipsis">
        {getAddressDisplayText({ address, name, label }) || ""}
      </Text>
    </Link>
  </FitContentSpan>
);

export const AmountBadge = ({ amount }: { amount: Amount | null }) => {
  if (!amount) return <BadgeText>-</BadgeText>;
  return (
    <BadgeText>
      <AmountText minSize="body2" maxSize="p4" value={amount.value || "0"} denom={amount.denom || ""} wrap={false} />
    </BadgeText>
  );
};

export const StorageDepositAmountBadge = ({
  storageDeposit,
  visibleStorageSize,
  visibleTooltip,
  visibleUsd = false,
}: {
  storageDeposit?: StorageDeposit | null;
  visibleStorageSize?: boolean;
  visibleTooltip?: boolean;
  visibleUsd?: boolean;
}) => {
  const displayStorageDepositData: Amount | null = React.useMemo(() => {
    if (!storageDeposit) return null;

    const converted = toGNOTAmount(storageDeposit.deposit, GNOTToken.denom);
    return converted;
  }, [storageDeposit]);

  if (!displayStorageDepositData) return <BadgeText>-</BadgeText>;

  return (
    <BadgeText>
      <StorageDepositText
        minSize="body1"
        maxSize="p4"
        denomSize="body1"
        {...toGNOTAmount(displayStorageDepositData.value, displayStorageDepositData.denom)}
        sizeInBytes={storageDeposit?.storage || 0}
        visibleStorageSize={visibleStorageSize}
        visibleTooltip={visibleTooltip}
      />
      {/* abs: released deposits render as "+X GNOT", so the USD value stays unsigned too. */}
      {visibleUsd && (
        <UsdValueText tokenKey={GNOTToken.denom} amount={BigNumber(displayStorageDepositData.value).abs()} />
      )}
    </BadgeText>
  );
};
