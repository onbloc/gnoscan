import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { isScamLabel } from "@/common/utils/address-label.utility";
import { ADDRESS_LABEL_TAG, ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { PHISHING_AFFECTED_WALLETS_URL, PHISHING_REPORT_SOURCE_URL } from "@/common/values/url.constant";
import { IconWarning } from "@/components/icons/IconWarning";
import Tooltip from "../tooltip";

interface PhishingWarningTooltipProps {
  labelType?: ADDRESS_LABEL_TYPE | null;
  labelTag?: ADDRESS_LABEL_TAG | null;
  // Compact 14x12 icon for table cells
  small?: boolean;
}

const OVERLAY_CLASS_NAME = "phishing-warning-overlay";

// antd caps tooltips at 250px; the design bubble is 302px (270px text + 16px padding) with a 8px radius and drop shadow.
const OverlayStyle = createGlobalStyle`
  .${OVERLAY_CLASS_NAME} {
    max-width: 302px;

    .ant-tooltip-inner {
      border-radius: 8px;
      box-shadow: 0 4px 2px rgba(0, 0, 0, 0.25);
    }
  }
`;

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
export const PhishingWarningTooltip = ({ labelType, labelTag, small = false }: PhishingWarningTooltipProps) => {
  if (!isScamLabel({ labelType, labelTag })) return null;

  return (
    <>
      <OverlayStyle />
      <WarningTooltip
        className="phishing-warning-tooltip"
        overlayClassName={OVERLAY_CLASS_NAME}
        content={<PhishingWarningContents />}
        width={302}
        openOnFocus
      >
        <IconButton tabIndex={0} role="img" aria-label="Phishing warning">
          {small ? <IconWarning width={14} height={12} /> : <IconWarning />}
        </IconButton>
      </WarningTooltip>
    </>
  );
};

// Puts the warning right after an address element; non-phishing addresses keep their markup untouched.
export const WithPhishingWarning = ({
  labelType,
  labelTag,
  small,
  children,
}: PhishingWarningTooltipProps & { children: React.ReactNode }) =>
  isScamLabel({ labelType, labelTag }) ? (
    <WarningRow $small={small}>
      {children}
      <PhishingWarningTooltip labelType={labelType} labelTag={labelTag} small={small} />
    </WarningRow>
  ) : (
    <>{children}</>
  );

const WarningTooltip = styled(Tooltip)`
  flex-shrink: 0;
  vertical-align: middle;
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
