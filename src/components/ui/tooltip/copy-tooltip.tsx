import React from "react";
import styled from "styled-components";

import IconCopy from "@/assets/svgs/icon-copy.svg";
import Tooltip from "./tooltip";

const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;

/**
 * Markup presets for the copy icon.
 * badge: hash rows inside summary badges
 * address: address and path badges in transaction details
 * path: package path and address rows styled by parent `.path-copy-tooltip` rules
 * plain: bare icon styled by the caller through className or iconClassName
 */
export type CopyTooltipVariant = "badge" | "address" | "path" | "plain";

const VARIANT_PRESETS: Record<
  CopyTooltipVariant,
  { className?: string; width?: number; icon: (iconClassName?: string) => React.ReactNode }
> = {
  badge: { icon: () => <StyledIconCopy className="svg-icon" /> },
  address: { className: "address-tooltip", icon: () => <StyledIconCopy /> },
  path: { className: "path-copy-tooltip", width: 85, icon: () => <IconCopy className="svg-icon" /> },
  plain: { icon: iconClassName => <IconCopy className={iconClassName} /> },
};

interface CopyTooltipProps {
  copyText?: string;
  variant?: CopyTooltipVariant;
  className?: string;
  iconClassName?: string;
}

export const CopyTooltip = ({ copyText, variant = "badge", className, iconClassName }: CopyTooltipProps) => {
  const preset = VARIANT_PRESETS[variant];
  const tooltipClassName = [preset.className, className].filter(Boolean).join(" ") || undefined;

  return (
    <Tooltip className={tooltipClassName} content="Copied!" trigger="click" copyText={copyText} width={preset.width}>
      {preset.icon(iconClassName)}
    </Tooltip>
  );
};
