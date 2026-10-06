import React from "react";
import Link from "next/link";

import { css } from "styled-components";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { TOOLTIP_NOT_YET_ENABLED } from "@/common/values/tooltip-content.constant";
import { PaletteKeyType } from "@/styles";
import { useGetRealmByPath } from "@/common/react-query/realm/api";

import * as S from "./TransactionMessageFields.styles";
import Badge from "@/components/ui/badge";
import { AddressTextBox, BadgeText } from "@/components/ui/detail-field";
import FloatingTooltip from "@/components/ui/floating-tooltip";
import IconInfo from "@/components/ui/icon-info";
import Text from "@/components/ui/text";
import { FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Tooltip from "@/components/ui/tooltip";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";

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

interface PkgPathLinkProps {
  path: string;
  getUrlWithNetwork: (uri: string) => string;
  isEllipsis?: boolean;
  visibleRealmStatus?: boolean;
}

const notYetEnabledBadgeStyle = css`
  min-height: 28px;
  background-color: #ff4d4f;
  margin-right: 0;
`;

const NotYetEnabledBadge = () => (
  <Badge cssExtend={notYetEnabledBadgeStyle}>
    <S.RealmStatusBadgeContent>
      <Text type="p4" color="white" fontWeight={400}>
        Not Yet Enabled
      </Text>
      <FloatingTooltip
        content={TOOLTIP_NOT_YET_ENABLED}
        className="not-yet-enabled-tooltip"
        ariaLabel="Show not yet enabled details"
      >
        <IconInfo size={16} fill="#ffffff" />
      </FloatingTooltip>
    </S.RealmStatusBadgeContent>
  </Badge>
);

const useIsRealmNotEnabled = (path: string, enabled: boolean) => {
  const { data, isFetched } = useGetRealmByPath(path, {
    enabled: enabled && !!path && path !== "-",
    retry: 1,
  });

  return isFetched && data?.data?.isEnableYn === "N";
};

export const PkgPathLink: React.FC<PkgPathLinkProps> = ({
  path,
  getUrlWithNetwork,
  isEllipsis,
  visibleRealmStatus,
}) => {
  const displayPkgPath = React.useMemo(() => {
    if (isEllipsis) {
      return formatDisplayPackagePath(path);
    }
    return path;
  }, [path]);
  const isRealmNotEnabled = useIsRealmNotEnabled(path, !!visibleRealmStatus);

  return (
    <S.PackagePathWrapper>
      <Badge>
        <AddressTextBox>
          <Text type="p4" color="blue" className="ellipsis">
            <Link href={getUrlWithNetwork(`/realms/details?path=${path}`)} passHref>
              <FitContentSpan>{displayPkgPath}</FitContentSpan>
            </Link>
          </Text>
          <CopyTooltip variant="address" copyText={path} />
        </AddressTextBox>
      </Badge>
      {isRealmNotEnabled && <NotYetEnabledBadge />}
    </S.PackagePathWrapper>
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
  visibleRealmStatus,
}: {
  items: BadgeTooltipProps[] | null;
  linkUrl?: string;
  getUrlWithNetwork?: (uri: string) => string;
  visibleRealmStatus?: boolean;
}) => {
  const hasLinkUrl = !!linkUrl;
  if (!items || items.length === 0) return <BadgeText>-</BadgeText>;
  return (
    <S.BadgeListWrapper>
      {items.map(item => (
        <HoverBadgeItem
          key={`${item.label}${item.tooltip}`}
          item={item}
          linkUrl={hasLinkUrl ? linkUrl : undefined}
          getUrlWithNetwork={getUrlWithNetwork}
          visibleRealmStatus={visibleRealmStatus}
        />
      ))}
    </S.BadgeListWrapper>
  );
};

const HoverBadgeItem = ({
  item,
  linkUrl,
  getUrlWithNetwork,
  visibleRealmStatus,
}: {
  item: BadgeTooltipProps;
  linkUrl?: string;
  getUrlWithNetwork?: (uri: string) => string;
  visibleRealmStatus?: boolean;
}) => {
  const isRealmNotEnabled = useIsRealmNotEnabled(item.tooltip, !!visibleRealmStatus);

  return (
    <S.PackagePathWrapper>
      <HoverBadgeText
        type="blue"
        color="white"
        tooltipContent={item.tooltip}
        hasLink={!!linkUrl}
        linkUrl={getUrlWithNetwork && linkUrl ? getUrlWithNetwork(`${linkUrl}${item.tooltip}`) : undefined}
      >
        {item.label}
      </HoverBadgeText>
      {isRealmNotEnabled && <NotYetEnabledBadge />}
    </S.PackagePathWrapper>
  );
};
