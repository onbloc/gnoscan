import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import Portal from "@/components/core/portal";
import mixins from "@/styles/mixins";
import MenuIcon from "@/assets/svgs/icon-menu-button.svg";
import CloseIcon from "@/assets/svgs/icon-close.svg";
import GnoscanLogo from "@/assets/svgs/icon-gnoscan-logo.svg";
import GnoscanLogoLight from "@/assets/svgs/icon-gnoscan-logo-light.svg";
import { mobileNavItems } from "./top-nav";
import Link from "next/link";
import { v1 } from "uuid";
import Text from "@/components/ui/text";
import { useBodyScrollLock } from "@/common/hooks/common/use-body-scroll-lock";
import { useNetwork } from "@/common/hooks/use-network";
import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";

interface LinkStyleProps {
  current: boolean;
}

interface SubMenuProps {
  entry: boolean;
  open: boolean;
  onClick: () => void;
  selector?: string;
  darkMode?: boolean;
  currentPath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  entry,
  open,
  onClick,
  selector = "modal-root",
  darkMode,
  currentPath,
}) => {
  const { getUrlWithNetwork } = useNetwork();
  useBodyScrollLock(open);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Moves focus into the open menu, closes it with Escape and hands focus back to the menu button.
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClick();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (container?.contains(document.activeElement)) menuButtonRef.current?.focus();
    };
  }, [open, onClick]);

  const close = () => setTimeout(onClick, 100);

  return (
    <>
      <MenuButton ref={menuButtonRef} entry={entry} onClick={onClick} aria-label="Open menu" aria-expanded={open}>
        <MenuIcon className="menu-icon" />
      </MenuButton>
      <Portal selector={selector}>
        <Container ref={containerRef} open={open}>
          <TopHeader>
            {darkMode ? <GnoscanLogo /> : <GnoscanLogoLight />}
            <CloseButton ref={closeButtonRef} onClick={onClick} aria-label="Close menu">
              <CloseIcon className="close-icon" />
            </CloseButton>
          </TopHeader>
          <Nav>
            {mobileNavItems.map(v => (
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
  // Hidden once it slides out, so Tab skips the links of the closed menu. Shown at once on open so focus can move in.
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  width: 100%;
  height: 100%;
  z-index: ${zindex.mobileMenu};
  transition: all 0.4s ease-out, visibility 0s ${({ open }) => (open ? "0s" : "0.4s")};
  padding: 0px 18px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${media.NOT_MOBILE} {
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

const StyledA = styled.span<LinkStyleProps>`
  display: inline-block;
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
