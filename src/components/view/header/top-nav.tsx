"use client";

import GnoscanLogoLight from "@/assets/svgs/icon-gnoscan-logo-light.svg";
import GnoscanLogo from "@/assets/svgs/icon-gnoscan-logo.svg";
import { useRouter } from "@/common/hooks/common/use-router";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useNetwork } from "@/common/hooks/use-network";
import { debounce } from "@/common/utils/string-util";
import { SubInput } from "@/components/ui/input";
import Network from "@/components/ui/network";
import Text from "@/components/ui/text";
import { searchState, themeState } from "@/states";
import mixins from "@/styles/mixins";
import theme from "@/styles/theme";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { SubMenu } from "./sub-menu";

interface EntryProps {
  entry?: boolean;
  darkMode?: boolean;
}

export const navItems = [
  {
    name: "Blocks",
    path: "/blocks",
  },
  {
    name: "Transactions",
    path: "/transactions",
  },
  {
    name: "Accounts",
    path: "/accounts",
  },
  {
    name: "Realms",
    path: "/realms",
  },
  {
    name: "Tokens",
    path: "/tokens",
  },
  {
    name: "Validators",
    path: "/validators",
  },
];

export const TopNav = () => {
  const router = useRouter();
  const themeMode = useRecoilValue(themeState);
  const isMain = router.route === "/";
  const entry = router.route === "/" || (router.route !== "/" && themeMode === "dark");
  const [value, setValue] = useRecoilState(searchState);
  const [open, setOpen] = useState(false);
  const toggleMenuHandler = () => setOpen((prev: boolean) => !prev);

  // The mobile menu is portaled outside the header, so close it (and release its scroll lock) on desktop.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);
  const navigateToHomeHandler = () => router.push("/");

  const { getUrlWithNetwork } = useNetwork();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(setValue(e.target.value), 1000);
    },
    [value],
  );

  return (
    <Wrapper entry={entry}>
      {entry ? (
        <GnoscanLogo className="logo-icon" onClick={navigateToHomeHandler} />
      ) : (
        <GnoscanLogoLight className="logo-icon" onClick={navigateToHomeHandler} />
      )}
      <div className="desktop-only">
        {!isMain && (
          <SubInput className="sub-search" value={value} onChange={onChange} clearValue={() => setValue("")} />
        )}
        <Nav>
          {navItems.map((v, index) => (
            <Link className="navigation-item" href={getUrlWithNetwork(v.path)} key={index}>
              <Text type="p4" color={entry ? "white" : "primary"}>
                {v.name}
              </Text>
            </Link>
          ))}
        </Nav>
      </div>

      <HeaderNetwork entry={entry} />
      <div className="not-desktop">
        <SubMenu
          entry={entry}
          open={open}
          onClick={toggleMenuHandler}
          darkMode={themeMode === "dark"}
          currentPath={router.route}
          network={<HeaderNetwork entry={themeMode === "dark"} inMenu />}
        />
      </div>
    </Wrapper>
  );
};

// Each instance keeps its own dropdown state, so the copy inside the mobile menu works independently.
const HeaderNetwork = ({ entry, inMenu }: { entry: boolean; inMenu?: boolean }) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const toggleHandler = useCallback(() => setToggle((prev: boolean) => !prev), []);

  const { chains } = useNetworkProvider();
  const { changeNetwork } = useNetwork();

  const networkSettingHandler = useCallback((chainId: string) => {
    changeNetwork(chainId);
    setToggle(false);
  }, []);

  return (
    <Network
      entry={entry}
      inMenu={inMenu}
      chains={chains}
      toggle={toggle}
      toggleHandler={toggleHandler}
      networkSettingHandler={networkSettingHandler}
      setToggle={setToggle}
    />
  );
};

const Wrapper = styled.div<EntryProps>`
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
  .desktop-only,
  .not-desktop {
    display: contents;
  }
  @media (min-width: 1280px) {
    .not-desktop {
      display: none;
    }
  }
  @media (max-width: 1279px) {
    .desktop-only {
      display: none;
    }
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
  gap: 35px;
  margin-right: 35px;

  .navigation-item {
    cursor: pointer;
  }
`;
