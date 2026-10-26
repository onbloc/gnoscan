import React from "react";
import styled from "styled-components";

import { isScamLabel } from "@/common/utils/address-label.utility";
import { zindex } from "@/common/values/z-index";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { PHISHING_AFFECTED_WALLETS_URL, PHISHING_REPORT_SOURCE_URL } from "@/common/values/url.constant";
import { IconWarning } from "@/components/icons/IconWarning";
import Tooltip from "../tooltip";

interface PhishingWarningTooltipProps {
  labelType?: ADDRESS_LABEL_TYPE | null;
  // 14x12 icon. Only the account header and the transaction message summary use the default 20x18.
  small?: boolean;
  // Offsets against the container's own spacing (e.g. its flex gap); negative values are allowed.
  marginLeft?: number;
  marginRight?: number;
}

// Rules for this overlay class live in the global style (src/styles/global-style.ts).
const OVERLAY_CLASS_NAME = "phishing-warning-overlay";

const PhishingWarningContents = () => (
  <ContentsWrapper>
    <strong>Phishing Suspicious — Reported drain destination</strong>
    <p>
      Reported to be receiving GNOT from ~2,979 user wallets since Oct 25, 2026. The Gno.land protocol itself is not
      compromised; the cause is under investigation. Do not send funds to this address.
    </p>
    <ul>
      <li>
        Source:{" "}
        <a href={PHISHING_REPORT_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          @_gnoland
        </a>
        {" · Updated Oct 26, 2026"}
      </li>
      <li>
        Affected Wallets:{" "}
        <a href={PHISHING_AFFECTED_WALLETS_URL} target="_blank" rel="noopener noreferrer">
          Google sheet
        </a>
      </li>
    </ul>
  </ContentsWrapper>
);

// Renders nothing unless the address is flagged as phishing, so callers can drop it in unconditionally.
export const PhishingWarningTooltip = ({
  labelType,
  small = false,
  marginLeft = 0,
  marginRight = 0,
}: PhishingWarningTooltipProps) => {
  if (!isScamLabel(labelType)) return null;

  return (
    <WarningTooltip
      className="phishing-warning-tooltip"
      overlayClassName={OVERLAY_CLASS_NAME}
      zIndex={zindex.modalTooltip}
      content={<PhishingWarningContents />}
      width={302}
      openOnFocus
      $marginLeft={marginLeft}
      $marginRight={marginRight}
    >
      <IconButton tabIndex={0} role="button" aria-label="Phishing warning. Do not send funds to this address.">
        {small ? <IconWarning width={14} height={12} /> : <IconWarning />}
      </IconButton>
    </WarningTooltip>
  );
};

// Puts the warning right after an address element; non-phishing addresses keep their markup untouched.
export const WithPhishingWarning = ({
  labelType,
  small,
  children,
}: Pick<PhishingWarningTooltipProps, "labelType" | "small"> & { children: React.ReactNode }) =>
  isScamLabel(labelType) ? (
    <WarningRow $small={small}>
      {children}
      <PhishingWarningTooltip labelType={labelType} small={small} />
    </WarningRow>
  ) : (
    <>{children}</>
  );

const WarningTooltip = styled(Tooltip)<{ $marginLeft: number; $marginRight: number }>`
  flex-shrink: 0;
  vertical-align: text-bottom;
  margin-left: ${({ $marginLeft }) => $marginLeft}px;
  margin-right: ${({ $marginRight }) => $marginRight}px;
`;

const WarningRow = styled.span<{ $small?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $small }) => ($small ? 4 : 5)}px;
  min-width: 0;
  max-width: 100%;
`;

const IconButton = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;

  & strong {
    font-weight: 700;
  }

  & p,
  & ul {
    margin: 0;
  }

  & ul {
    padding-left: 18px;
    list-style: disc;
  }

  & li + li {
    margin-top: 4px;
  }

  & a {
    color: inherit;
    text-decoration: underline;
    text-underline-position: from-font;
  }
`;

export default PhishingWarningTooltip;
