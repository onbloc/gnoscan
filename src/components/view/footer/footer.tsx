"use client";

import mixins from "@/styles/mixins";
import React from "react";
import styled, { css } from "styled-components";
import { DarkModeToggle } from "@/components/ui/button";
import Discord from "@/assets/svgs/icon-discord.svg";
import Twitter from "@/assets/svgs/icon-x.svg";
import GnoscanSymbol from "@/assets/svgs/icon-gnoscan-symbol.svg";
import GnoscanSymbolLight from "@/assets/svgs/icon-gnoscan-symbol-light.svg";
import Text from "@/components/ui/text";
import { v1 } from "uuid";
import { useThemeMode } from "@/common/hooks/use-theme-mode";
import { media } from "@/common/values/ui.constant";

const termsText = [
  { title: "Terms of Service", path: "/terms/service" },
  { title: "Contact", path: "mailto:info@gnoscan.io" },
  { title: "Feedback", path: "https://forms.gle/6L2yop3bEMwxk3KJ6" },
];

const Definition = () => {
  const { isDark } = useThemeMode();

  return (
    <DefinitionWrapper>
      {isDark ? (
        <GnoscanSymbol className="svg-icon" width="18" height="18" />
      ) : (
        <GnoscanSymbolLight className="svg-icon" width="18" height="18" />
      )}
      <Text type="body1" desktopType="p4" color="tertiary">
        Powered by Gno.land Blockchain
      </Text>
    </DefinitionWrapper>
  );
};

const Copyright = () => {
  const year = new Date().getFullYear();
  return (
    <Text type="body1" desktopType="p4" color="tertiary" margin="0 9px 0 0">
      {`@ ${year} GnoScan`}
    </Text>
  );
};

const Terms = () => (
  <FTextWrapper>
    {termsText.map(v => (
      <a className="hr-text" href={v.path} key={v1()}>
        <Text type="body1" desktopType="p4" color="tertiary">
          {v.title}
        </Text>
      </a>
    ))}
  </FTextWrapper>
);

const Community = () => (
  <CommunityWrapper>
    <Text type="body1" desktopType="p4" color="tertiary" className="hr-text">
      Community:
    </Text>
    <SNS href="https://twitter.com/gnoscan" target="_blank" aria-label="Twitter">
      <Twitter className="svg-icon" />
    </SNS>
    <SNS href="https://discord.gg/Bhgkr7hMEz" target="_blank" aria-label="Discord">
      <Discord className="svg-icon" />
    </SNS>
    <DarkModeToggle className="f-toggle" />
  </CommunityWrapper>
);

export const Footer = () => {
  return (
    <Wrapper>
      <div className="inner-layout">
        <Definition />
        <Copyright />
        <Terms />
        <Community />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  ${mixins.flexbox("row", "center", "center")}
  background-color: ${({ theme }) => theme.colors.base};
  margin-top: auto;
  padding: 24px 18px;
  height: 194px;
  .inner-layout {
    height: 100%;
    ${mixins.flexbox("column", "center", "center")};
  }
  .svg-icon {
    fill: ${({ theme }) => theme.colors.primary};
    path {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }
  ${media.DESKTOP} {
    height: 80px;
    .inner-layout {
      ${mixins.flexbox("row", "center", "flex-start")}
    }
  }
`;

// Last on mobile, first on desktop.
const DefinitionWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 6px;
  ${media.NOT_DESKTOP} {
    order: 1;
    margin-top: auto;
  }
  ${media.DESKTOP} {
    margin-right: auto;
  }
`;

const Hr = css`
  content: "";
  height: 12px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  ${mixins.posTopCenterLeft("-9px")}
`;

const FTextWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  .hr-text {
    margin: 0px 9px;
    ${mixins.flexbox("row", "center", "center", false)};
    flex-wrap: wrap;
    position: relative;
    :before {
      ${Hr};
    }
  }
  ${media.NOT_DESKTOP} {
    margin: 16px auto 24px;
    .hr-text:first-of-type:before {
      display: none;
    }
  }
`;

const CommunityWrapper = styled(FTextWrapper)`
  margin: 0px;
  .f-toggle {
    margin-left: 9px;
    :before {
      ${Hr};
    }
  }
`;

const SNS = styled.a`
  ${mixins.flexbox("row", "center", "center")};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-right: 9px;
  :first-of-type {
    margin-left: 9px;
  }
`;
