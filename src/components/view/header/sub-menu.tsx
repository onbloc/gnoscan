"use client";

import React, { useLayoutEffect } from "react";
import styled, { css } from "styled-components";
import Portal from "@/components/core/portal";
import mixins from "@/styles/mixins";
import MenuIcon from "@/assets/svgs/icon-menu-button.svg";
import CloseIcon from "@/assets/svgs/icon-close.svg";
import GnoscanLogo from "@/assets/svgs/icon-gnoscan-logo.svg";
import GnoscanLogoLight from "@/assets/svgs/icon-gnoscan-logo-light.svg";
import { navItems } from "./top-nav";
import Link from "next/link";
import { v1 } from "uuid";
import Text from "@/components/ui/text";
import { useNetwork } from "@/common/hooks/use-network";
import { media } from "@/common/values/ui.constant";

interface LinkStyleProps {
  current: boolean;
}

interface SubMenuProps {
  entry: boolean;
  open: boolean;
  onClick: (e: React.MouseEvent) => void;
  selector?: string;
  darkMode?: boolean;
  currentPath: string;
  network?: React.ReactNode;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  entry,
  open,
  onClick,
  selector = "modal-root",
  darkMode,
  currentPath,
  network,
}) => {
  const { getUrlWithNetwork } = useNetwork();
  useLayoutEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const close = (e: React.MouseEvent<HTMLElement>) => setTimeout(() => onClick(e), 100);

  return (
    <>
      <MenuButton entry={entry} onClick={onClick}>
        <MenuIcon className="menu-icon" />
      </MenuButton>
      <Portal selector={selector}>
        <Container open={open}>
          <TopHeader>
            {darkMode ? <GnoscanLogo /> : <GnoscanLogoLight />}
            {network}
            <CloseButton onClick={onClick}>
              <CloseIcon className="close-icon" />
            </CloseButton>
          </TopHeader>
          <Nav>
            {navItems.map((v, i) => (
              <Link href={getUrlWithNetwork(v.path)} passHref key={v1()} onClick={close}>
                <StyledA current={currentPath === v.path}>
                  <Text type="h4" color="primary">
                    {v.name}
                  </Text>
                </StyledA>
              </Link>
            ))}
          </Nav>
        </Container>
      </Portal>
    </>
  );
};

const Container = styled.div<{ open: boolean }>`
  ${mixins.flexbox("column", "center", "flex-start")}
  background-color: ${({ theme }) => theme.colors.base};
  position: fixed;
  top: 0px;
  right: ${({ open }) => (open ? "0px" : "100%")};
  width: 100%;
  height: 100%;
  // Covers the header network button (z-index 99) so the copy in TopHeader slides in with the menu.
  z-index: 100;
  transition: all 0.4s ease-out;
  padding: 0px 18px 20px;
  overflow: hidden;

  ${media.DESKTOP} {
    display: none;
  }
`;

const MenuButton = styled.button<{ entry: boolean }>`
  margin-left: 16px;
  .menu-icon {
    stroke: ${({ entry, theme }) => (entry ? theme.colors.white : theme.colors.primary)};
  }
`;

// Matches the top nav layout so the menu header lines up with the page header.
const TopHeader = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  gap: 16px;
  & > svg:first-child {
    margin-right: auto;
  }
`;

const Nav = styled.nav`
  ${mixins.flexbox("column", "center", "center")};
  gap: 48px;
  margin-top: 32px;
  ${mixins.positionCenter()};

  ${media.MOBILE} {
    gap: 36px;
  }
`;

const StyledA = styled.a<LinkStyleProps>`
  padding: 10px 10px 12px;
  ${({ current }) =>
    current &&
    css`
      text-decoration-line: underline;
      text-underline-offset: 9px;
      text-decoration-thickness: 2px;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
    `}
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  .close-icon {
    stroke: ${({ theme }) => theme.colors.reverse};
  }
`;
