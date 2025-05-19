import React, { CSSProperties } from "react";
import Link from "next/link";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { PaletteKeyType } from "@/styles";
import { Amount } from "@/types/data-type";
import { scrollbarStyle } from "@/common/hooks/use-scroll-bar";

import * as S from "./TransactionMessageFields.styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Tooltip from "@/components/ui/tooltip";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import { AmountText } from "@/components/ui/text/amount-text";

interface FieldProps {
  label: string;
  children: React.ReactNode;
  isDesktop: boolean;
}

export const Field: React.FC<FieldProps> = ({ label, children, isDesktop }) => (
  <DLWrap desktop={isDesktop}>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </DLWrap>
);

interface FieldWithTooltipProps extends FieldProps {
  tooltipContent: React.ReactNode | string;
}

export const FieldWithTooltip: React.FC<FieldWithTooltipProps> = ({ label, tooltipContent, children, isDesktop }) => (
  <DLWrap desktop={isDesktop}>
    <dt>
      {label}
      <div className="tooltip-wrapper">
        <Tooltip content={tooltipContent}>
          <IconTooltip />
        </Tooltip>
      </div>
    </dt>
    <dd>{children}</dd>
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
  margin: 0,
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

interface HoverBadgeTextProps {
  type?: PaletteKeyType;
  color?: string;
  tooltipContent?: React.ReactNode | string;
  hasLink?: boolean;
  linkUrl?: string;
  extraCount?: number;
  children: React.ReactNode;
}

export const HoverBadgeText: React.FC<HoverBadgeTextProps> = ({
  type,
  color = "primary",
  tooltipContent,
  linkUrl,
  extraCount = 0,
  children,
}) => {
  const renderTooltipContent = () => {
    if (!tooltipContent) return null;
    if (linkUrl) {
      return (
        <Link href={linkUrl} passHref>
          <S.TooltipContentWrapper>
            {typeof tooltipContent === "string" ? <span className="info">{tooltipContent}</span> : tooltipContent}
          </S.TooltipContentWrapper>
        </Link>
      );
    }

    return (
      <S.TooltipContentWrapper>
        {typeof tooltipContent === "string" ? <span className="info">{tooltipContent}</span> : tooltipContent}
      </S.TooltipContentWrapper>
    );
  };

  const renderTextContent = () => {
    const textContent = (
      <Text type="p4" color={color || "primary"} className={"ellipsis"}>
        {children}
      </Text>
    );

    return textContent;
  };

  return (
    <BadgeText type={type}>
      <S.BadgeContentWrapper>
        {tooltipContent ? (
          <Tooltip content={renderTooltipContent()}>{renderTextContent()}</Tooltip>
        ) : (
          renderTextContent()
        )}

        {extraCount > 0 && (
          <Text type="p4" color={color || "primary"} margin="0px 0px 0px 8px">
            {`+${extraCount}`}
          </Text>
        )}
      </S.BadgeContentWrapper>
    </BadgeText>
  );
};

interface AddressLinkProps {
  to: string;
  copyText: string;
  getUrlWithNetwork: (uri: string) => string;
}

export const AddressLink: React.FC<AddressLinkProps> = ({ to, copyText, getUrlWithNetwork }) => (
  <Badge>
    <S.AddressTextBox>
      <Text type="p4" color="blue" className="ellipsis">
        <Link href={getUrlWithNetwork(`/account/${to}`)} passHref>
          <FitContentA>{to}</FitContentA>
        </Link>
      </Text>
      <Tooltip content="Copied!" trigger="click" copyText={copyText} className="address-tooltip">
        <S.StyledIconCopy />
      </Tooltip>
    </S.AddressTextBox>
  </Badge>
);

interface PkgPathLinkProps {
  path: string;
  getUrlWithNetwork: (uri: string) => string;
  isEllipsis?: boolean;
}

export const PkgPathLink: React.FC<PkgPathLinkProps> = ({ path, getUrlWithNetwork, isEllipsis }) => {
  const displayPkgPath = React.useMemo(() => {
    if (isEllipsis) {
      return formatDisplayPackagePath(path);
    }
    return path;
  }, [path]);

  return (
    <Badge>
      <S.AddressTextBox>
        <Text type="p4" color="blue" className="ellipsis">
          <Link href={getUrlWithNetwork(`/realms/details?path=${path}`)} passHref>
            <FitContentA>{displayPkgPath}</FitContentA>
          </Link>
        </Text>
        <Tooltip content="Copied!" trigger="click" copyText={path} className="address-tooltip">
          <S.StyledIconCopy />
        </Tooltip>
      </S.AddressTextBox>
    </Badge>
  );
};

export const BadgeList = ({ items }: { items: string[] | null }) => {
  if (!items || items.length === 0) return <BadgeText>-</BadgeText>;
  return (
    <S.BadgeListWrapper>
      {items.map(item => (
        <BadgeText key={item}>{item}</BadgeText>
      ))}
    </S.BadgeListWrapper>
  );
};

export interface BadgeTooltipProps {
  label: string;
  tooltip: string;
  linkUrl?: string;
}

export const HoverBadgeList = ({
  items,
  linkUrl,
  getUrlWithNetwork,
}: {
  items: BadgeTooltipProps[] | null;
  linkUrl?: string;
  getUrlWithNetwork?: (uri: string) => string;
}) => {
  const hasLinkUrl = !!linkUrl;
  if (!items || items.length === 0) return <BadgeText>-</BadgeText>;
  return (
    <>
      {items.map(item => (
        <HoverBadgeText
          key={`${item.label}${item.tooltip}`}
          type="blue"
          color="white"
          tooltipContent={item.tooltip}
          hasLink={hasLinkUrl}
          linkUrl={getUrlWithNetwork ? getUrlWithNetwork(`${linkUrl}${item.tooltip}`) : undefined}
        >
          {item.label}
        </HoverBadgeText>
      ))}
    </>
  );
};

export const AmountBadge = ({ amount }: { amount: Amount | null }) => {
  if (!amount) return <BadgeText>-</BadgeText>;
  return (
    <BadgeText>
      <AmountText minSize="body2" maxSize="p4" value={amount.value || "0"} denom={amount.denom || ""} />
    </BadgeText>
  );
};
