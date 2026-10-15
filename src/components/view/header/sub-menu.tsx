import React from "react";
import styled from "styled-components";
import Portal from "@/components/core/portal";
import mixins from "@/styles/mixins";
import MenuIcon from "@/assets/svgs/icon-menu-button.svg";
import CloseIcon from "@/assets/svgs/icon-close.svg";
import GnoscanLogo from "@/assets/svgs/icon-gnoscan-logo.svg";
import GnoscanLogoLight from "@/assets/svgs/icon-gnoscan-logo-light.svg";
import { mobileNavItems } from "./top-nav";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import Text from "@/components/ui/text";
import { useBodyScrollLock } from "@/common/hooks/common/use-body-scroll-lock";
import { useNetwork } from "@/common/hooks/use-network";
import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";
import { themeState } from "@/states";

interface SubMenuProps {
  open: boolean;
  onToggle: () => void;
  // True when the header behind the menu button is dark, so the button icon is drawn in white.
  darkSurface: boolean;
  currentPath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({ open, onToggle, darkSurface, currentPath }) => {
  const { getUrlWithNetwork } = useNetwork();
  const darkMode = useRecoilValue(themeState) === "dark";
  useBodyScrollLock(open);

  const close = () => setTimeout(onToggle, 100);

  return (
    <>
      <MenuButton darkSurface={darkSurface} onClick={onToggle}>
        <MenuIcon className="menu-icon" />
      </MenuButton>
      <Portal selector="modal-root">
        <Container open={open}>
          <TopHeader>
            {darkMode ? <GnoscanLogo /> : <GnoscanLogoLight />}
            <CloseButton onClick={onToggle}>
              <CloseIcon className="close-icon" />
            </CloseButton>
          </TopHeader>
          <Nav>
            {mobileNavItems.map(v => (
              <NavLink
                href={getUrlWithNetwork(v.path)}
                key={v.path}
                onClick={close}
                aria-current={currentPath === v.path ? "page" : undefined}
              >
                <Text type="h4" color="primary">
                  {v.name}
                </Text>
              </NavLink>
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
  z-index: ${zindex.mobileMenu};
  transition: all 0.4s ease-out;
  padding: 0px 18px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${media.NOT_MOBILE} {
    display: none;
  }
`;

const MenuButton = styled.button<{ darkSurface: boolean }>`
  margin-left: 16px;
  .menu-icon {
    stroke: ${({ darkSurface, theme }) => (darkSurface ? theme.colors.white : theme.colors.primary)};
  }
`;

// Matches the top nav layout so the menu header lines up with the page header.
const TopHeader = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  & > svg:first-child {
    margin-right: auto;
  }
`;

// Centered in the space below the header while it fits, and scrollable from the top when it does not.
const Nav = styled.nav`
  ${mixins.flexbox("column", "center", "center")};
  flex-shrink: 0;
  gap: 36px;
  margin: auto 0;
  padding: 24px 0 40px;
`;

const NavLink = styled(Link)`
  display: inline-block;
  padding: 10px 10px 12px;
  &[aria-current="page"] {
    text-decoration-line: underline;
    text-underline-offset: 9px;
    text-decoration-thickness: 2px;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  .close-icon {
    stroke: ${({ theme }) => theme.colors.reverse};
  }
`;
