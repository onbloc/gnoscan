import React from "react";
import Link from "next/link";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { PaletteKeyType } from "@/styles";

import * as S from "./TransactionMessageFields.styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Tooltip from "@/components/ui/tooltip";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";

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

export const BadgeText: React.FC<BadgeTextProps> = ({ type, color = "secondary", children }) => (
  <Badge type={type}>
    <Text type="p4" color={color || "secondary"}>
      {children}
    </Text>
  </Badge>
);

interface HoverBadgeTextProps {
  type?: PaletteKeyType;
  color?: string;
  tooltipContent?: React.ReactNode | string;
  extraCount?: number;
  children: React.ReactNode;
}

export const HoverBadgeText: React.FC<HoverBadgeTextProps> = ({
  type,
  color = "secondary",
  tooltipContent,
  extraCount = 0,
  children,
}) => {
  const renderTooltipContent = () => {
    if (!tooltipContent) return null;

    return (
      <S.TooltipContentWrapper>
        {typeof tooltipContent === "string" ? <span className="info">{tooltipContent}</span> : tooltipContent}
      </S.TooltipContentWrapper>
    );
  };

  return (
    <BadgeText type={type}>
      <S.BadgeContentWrapper>
        {tooltipContent ? (
          <Tooltip content={renderTooltipContent()}>
            <Text type="p4" color={color || "secondary"} className="ellipsis">
              {children}
            </Text>
          </Tooltip>
        ) : (
          <Text type="p4" color={color || "secondary"}>
            {children}
          </Text>
        )}

        {extraCount > 0 && (
          <Text type="p4" color={color || "secondary"} margin="0px 0px 0px 8px">
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
}

export const PkgPathLink: React.FC<PkgPathLinkProps> = ({ path, getUrlWithNetwork }) => {
  const formattedPath = formatDisplayPackagePath(path);

  return (
    <Badge>
      <S.AddressTextBox>
        <Text type="p4" color="blue" className="ellipsis">
          <Link href={getUrlWithNetwork(`/realms/details?path=${path}`)} passHref>
            <FitContentA>{formattedPath}</FitContentA>
          </Link>
        </Text>
        <Tooltip content="Copied!" trigger="click" copyText={path} className="address-tooltip">
          <S.StyledIconCopy />
        </Tooltip>
      </S.AddressTextBox>
    </Badge>
  );
};
