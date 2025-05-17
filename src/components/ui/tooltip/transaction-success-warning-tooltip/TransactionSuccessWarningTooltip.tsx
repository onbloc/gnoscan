import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import { media } from "@/common/values/ui.constant";
import { themeState } from "@/states";
import { default as themeStyle } from "@/styles/theme";
import { IconWarning } from "@/components/icons/IconWarning";
import Tooltip from "../tooltip";
import { EFFECTIVE_GNO_EMBRACE_PANIC_DOC_URL } from "@/common/values/url.constant";

const TxSuccessWarningTooltipContents = () => {
  const themeMode = useRecoilValue(themeState);

  const getCurrentTheme = () => {
    return themeMode === "dark" ? themeStyle.darkTheme : themeStyle.lightTheme;
  };

  return (
    <TooltipContentWrapper>
      This transaction succeeded at the VM level, <br />
      but returned an application-level error. Your <br />
      action may not have taken effect.{" "}
      <Link href={EFFECTIVE_GNO_EMBRACE_PANIC_DOC_URL} target="_blank" style={{ color: getCurrentTheme().tertiary }}>
        Learn more
      </Link>
    </TooltipContentWrapper>
  );
};

const TransactionSuccessWarningTooltip = () => {
  return (
    <TooltipWrapper>
      <Tooltip className="tx-warning-tooltip" content={<TxSuccessWarningTooltipContents />} width={277}>
        <IconWarning />
      </Tooltip>
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;

  margin: 12px 0 0;
  ${media.DESKTOP} {
    margin: 0 0 0 -5px;
  }
`;

const TooltipContentWrapper = styled.span`
  & > a {
    line-height: 16px;
    text-decoration: underline;
    text-underline-offset: 1px;
  }
`;

export default TransactionSuccessWarningTooltip;
