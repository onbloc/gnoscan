"use client";

import GnoscanLogoLight from "@/assets/svgs/icon-gnoscan-logo-light.svg";
import GnoscanLogo from "@/assets/svgs/icon-gnoscan-logo.svg";
import { useRouter } from "@/common/hooks/common/use-router";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useNetwork } from "@/common/hooks/use-network";
import { SubInput } from "@/components/ui/input";
import Network from "@/components/ui/network";
import Text from "@/components/ui/text";
import { searchState, themeState } from "@/states";
import mixins from "@/styles/mixins";
import theme from "@/styles/theme";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { media } from "@/common/values/ui.constant";
import { SubMenu } from "./sub-menu";
import IconChevron from "@/assets/svgs/icon-chevron.svg";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { zindex } from "@/common/values/z-index";

const HEADER_MOBILE_MAX_WIDTH = 600;

// Whether the header sits on a dark background, so text and icons render white.
interface WrapperProps {
  entry: boolean;
}

interface NavLink {
  name: string;
  path: string;
}

interface NavGroup {
  name: string;
  items: NavLink[];
}

const blocksLink = { name: "Blocks", path: "/blocks" };
const transactionsLink = { name: "Transactions", path: "/transactions" };
const accountsLink = { name: "Accounts", path: "/accounts" };
const validatorsLink = { name: "Validators", path: "/validators" };
const tokensLink = { name: "Tokens", path: "/tokens" };
const nftsLink = { name: "NFTs", path: "/nfts" };
const realmsLink = { name: "Realms", path: "/realms" };

/**
 * Header navigation shown from tablet width up, in display order.
 *
 * A {@link NavGroup} renders as a dropdown, and a {@link NavLink} renders as a plain link.
 * Paths are relative to the site root and get the network query from `getUrlWithNetwork`.
 */
export const navItems: (NavLink | NavGroup)[] = [
  { name: "Home", path: "/" },
  { name: "Blockchain", items: [blocksLink, transactionsLink, accountsLink, validatorsLink] },
  tokensLink,
  nftsLink,
  realmsLink,
];

/**
 * Mobile menu entries, in display order.
 *
 * Holds every page from {@link navItems} except Home, without grouping. The order follows the
 * mobile design and differs from the header, so it is kept as its own list instead of
 * flattening {@link navItems}.
 */
export const mobileNavItems: NavLink[] = [
  blocksLink,
  transactionsLink,
  accountsLink,
  tokensLink,
  nftsLink,
  realmsLink,
  validatorsLink,
];

export const TopNav = () => {
  const router = useRouter();
  const themeMode = useRecoilValue(themeState);
  const isMain = router.route === "/";
  const entry = isMain || themeMode === "dark";
  const [value, setValue] = useRecoilState(searchState);
  const [open, setOpen] = useState(false);
  const toggleMenuHandler = () => setOpen((prev: boolean) => !prev);

  // The mobile menu is portaled outside the header, so close it (and release its scroll lock) above mobile.
  useEffect(() => {
    const notMobileQuery = window.matchMedia(`(min-width: ${HEADER_MOBILE_MAX_WIDTH + 1}px)`);
    const closeAboveMobile = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    notMobileQuery.addEventListener("change", closeAboveMobile);
    return () => notMobileQuery.removeEventListener("change", closeAboveMobile);
  }, []);
  const navigateToHomeHandler = () => router.push("/");

  const { getUrlWithNetwork } = useNetwork();

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [setValue]);

  return (
    <Wrapper entry={entry}>
      {entry ? (
        <GnoscanLogo className="logo-icon" onClick={navigateToHomeHandler} />
      ) : (
        <GnoscanLogoLight className="logo-icon" onClick={navigateToHomeHandler} />
      )}
      {!isMain && (
        <div className="only-desktop">
          <SubInput className="sub-search" value={value} onChange={onChange} clearValue={() => setValue("")} />
        </div>
      )}
      <div className="header-navigation">
        <Nav>
          {navItems.map(v =>
            "items" in v ? (
              <NavDropdown key={v.name} group={v} entry={entry} currentPath={router.route} />
            ) : (
              <Link className="navigation-item" href={getUrlWithNetwork(v.path)} key={v.name}>
                <Text type="p4" color={entry ? "white" : "primary"}>
                  {v.name}
                </Text>
              </Link>
            ),
          )}
        </Nav>
      </div>

      <HeaderNetwork />
      <div className="header-mobile-menu">
        <SubMenu
          entry={entry}
          open={open}
          onClick={toggleMenuHandler}
          darkMode={themeMode === "dark"}
          currentPath={router.route}
          network={<HeaderNetwork />}
        />
      </div>
    </Wrapper>
  );
};

// Each instance keeps its own dropdown state, so the copy inside the mobile menu works independently.
// Both header surfaces use the black network button, independent of the page theme.
const HeaderNetwork = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const toggleHandler = useCallback(() => setToggle((prev: boolean) => !prev), []);

  const { chains } = useNetworkProvider();
  const { changeNetwork } = useNetwork();

  // Depend on changeNetwork so it reads the provider's chains, not the initial chains.json default.
  const networkSettingHandler = useCallback(
    (chainId: string) => {
      changeNetwork(chainId);
      setToggle(false);
    },
    [changeNetwork],
  );

  return (
    <Network
      entry
      chains={chains}
      toggle={toggle}
      toggleHandler={toggleHandler}
      networkSettingHandler={networkSettingHandler}
      setToggle={setToggle}
    />
  );
};

const Wrapper = styled.div<WrapperProps>`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
  height: 80px;
  .svg-icon {
    fill: ${({ entry }) => (entry ? theme.darkTheme.reverse : theme.lightTheme.reverse)};
  }
  .logo-icon {
    flex-shrink: 0;
    cursor: pointer;
  }
  // CSS picks the layout so the server HTML matches the hydrated header.
  .only-desktop,
  .header-navigation,
  .header-mobile-menu {
    display: contents;
  }
  @media (max-width: ${HEADER_MOBILE_MAX_WIDTH}px) {
    .header-navigation {
      display: none;
    }
  }
  @media (min-width: ${HEADER_MOBILE_MAX_WIDTH + 1}px) {
    .header-mobile-menu {
      display: none;
    }
  }
  ${media.NOT_DESKTOP} {
    .logo-icon {
      margin-right: auto;
    }
  }
  .sub-search {
    width: 396px;
    margin-left: 64px;
    margin-right: 32px;
  }
`;

const Nav = styled.nav`
  ${mixins.flexbox("row", "center", "center")};
  margin-left: auto;
  gap: 32px;
  margin-right: 28px;

  ${media.NOT_DESKTOP} {
    gap: 24px;
    margin-right: 16px;
  }

  .navigation-item {
    cursor: pointer;
  }
`;

interface NavDropdownProps {
  group: NavGroup;
  entry: boolean;
  currentPath: string;
}

const NavDropdown = ({ group, entry, currentPath }: NavDropdownProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const [open, setOpen] = useState(false);
  const mouseHovered = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutSideClick(close);

  return (
    <DropdownWrapper
      ref={ref as React.RefObject<HTMLDivElement>}
      open={open}
      onPointerEnter={e => {
        if (e.pointerType !== "mouse") return;
        mouseHovered.current = true;
        setOpen(true);
      }}
      onPointerLeave={e => {
        if (e.pointerType !== "mouse") return;
        mouseHovered.current = false;
        close();
      }}
      onKeyDown={e => {
        if (e.key !== "Escape" || !open) return;
        close();
        triggerRef.current?.focus();
      }}
      onBlur={e => {
        // Close once focus leaves the whole dropdown, not when it moves between its children.
        if (mouseHovered.current || e.currentTarget.contains(e.relatedTarget)) return;
        close();
      }}
    >
      <DropdownButton
        ref={triggerRef}
        type="button"
        entry={entry}
        open={open}
        aria-expanded={open}
        // Mouse clicks keep the hovered menu open; keyboard and touch clicks still toggle.
        onClick={e => setOpen(previous => (e.detail > 0 && mouseHovered.current ? true : !previous))}
      >
        <Text type="p4" color={entry ? "white" : "primary"}>
          {group.name}
        </Text>
        {/* Preserve scaling into the CSS dimensions; SVG optimization removes the asset's viewBox. */}
        <IconChevron className="chevron" viewBox="0 0 11.4674 7.18129" />
      </DropdownButton>
      <DropdownList open={open}>
        {group.items.map(item => {
          const selected = currentPath === item.path;
          return (
            <li key={item.path}>
              <Link href={getUrlWithNetwork(item.path)} className={selected ? "selected" : ""} onClick={close}>
                <Text type="p4" color={selected ? "primary" : "tertiary"}>
                  {item.name}
                </Text>
              </Link>
            </li>
          );
        })}
      </DropdownList>
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div<{ open: boolean }>`
  position: relative;

  // Keep the menu hovered while crossing the space below the trigger. Lives on the
  // untransformed wrapper so the hit area stays continuous during the open animation.
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 122px;
    height: 18px;
    pointer-events: ${({ open }) => (open ? "auto" : "none")};
  }
`;

const DropdownButton = styled.button<{ entry: boolean; open: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  gap: 6px;
  border-radius: 4px;

  &:focus-visible {
    outline: 1px solid ${({ entry, theme }) => (entry ? theme.colors.white : theme.colors.primary)};
    outline-offset: 4px;
  }

  .chevron {
    width: 8px;
    height: 4.57px;
    transform: rotate(${({ open }) => (open ? "0deg" : "180deg")});
    transition: transform 0.3s ease;
  }
  .chevron path {
    stroke: ${({ entry, theme }) => (entry ? theme.colors.white : theme.colors.primary)};
  }
`;

const DropdownList = styled.ul<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  top: calc(100% + 18px);
  left: 0;
  width: 122px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  background-color: ${({ theme }) => theme.colors.surface};
  opacity: ${({ open }) => (open ? "1" : "0")};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  transform: ${({ open }) => (open ? "scale(1)" : "scale(0.5)")};
  transform-origin: top left;
  transition: all 0.3s ease;
  // Above the home page search box, which overlaps the bottom of the list.
  z-index: ${zindex.searchResult + 1};

  a {
    ${mixins.flexbox("row", "center", "center")};
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.hover};
    }
    &.selected {
      background-color: ${({ theme }) => theme.colors.select};
    }
  }
`;
