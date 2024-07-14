'use client';

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {useRouter} from '@/common/hooks/common/use-router';
import GnoscanLogo from '@/assets/svgs/icon-gnoscan-logo.svg';
import GnoscanLogoLight from '@/assets/svgs/icon-gnoscan-logo-light.svg';
import {searchState, themeState} from '@/states';
import {useRecoilState, useRecoilValue} from 'recoil';
import Text from '@/components/ui/text';
import theme from '@/styles/theme';
import mixins from '@/styles/mixins';
import {isDesktop} from '@/common/hooks/use-media';
import dynamic from 'next/dynamic';
import {SubInput} from '@/components/ui/input';
import Network from '@/components/ui/network';
import {SubMenu} from './sub-menu';
import {debounce} from '@/common/utils/string-util';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {useNetwork} from '@/common/hooks/use-network';

const Desktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.Desktop), {
  ssr: false,
});
const NotDesktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.NotDesktop), {
  ssr: false,
});
interface EntryProps {
  entry?: boolean;
  darkMode?: boolean;
  isDesktop?: boolean;
}

export const navItems = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Blocks',
    path: '/blocks',
  },
  {
    name: 'Transactions',
    path: '/transactions',
  },
  {
    name: 'Realms',
    path: '/realms',
  },
  {
    name: 'Tokens',
    path: '/tokens',
  },
];

export const TopNav = () => {
  const router = useRouter();
  const themeMode = useRecoilValue(themeState);
  const isMain = router.route === '/';
  const entry = router.route === '/' || (router.route !== '/' && themeMode === 'dark');
  const [value, setValue] = useRecoilState(searchState);
  const [toggle, setToggle] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const desktop = isDesktop();
  const toggleMenuHandler = () => setOpen((prev: boolean) => !prev);
  const navigateToHomeHandler = () => router.push('/');
  const toggleHandler = useCallback(() => setToggle((prev: boolean) => !prev), [toggle]);

  const {chains} = useNetworkProvider();
  const {changeNetwork} = useNetwork();

  const movePage = (url: string) => {
    router.push(url);
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(setValue(e.target.value), 1000);
    },
    [value],
  );

  const networkSettingHandler = useCallback((chainId: string) => {
    changeNetwork(chainId);
    setToggle(false);
  }, []);

  return (
    <Wrapper isDesktop={desktop} entry={entry}>
      {entry ? (
        <GnoscanLogo className="logo-icon" onClick={navigateToHomeHandler} />
      ) : (
        <GnoscanLogoLight className="logo-icon" onClick={navigateToHomeHandler} />
      )}
      <Desktop>
        {!isMain && (
          <SubInput
            className="sub-search"
            value={value}
            onChange={onChange}
            clearValue={() => setValue('')}
          />
        )}
        <Nav>
          {navItems.map((v, index) => (
            <div className="navigation-item" onClick={() => movePage(v.path)} key={index}>
              <Text type="p4" color={entry ? 'white' : 'primary'}>
                {v.name}
              </Text>
            </div>
          ))}
        </Nav>
      </Desktop>

      <Network
        entry={entry}
        chains={chains}
        toggle={toggle}
        toggleHandler={toggleHandler}
        networkSettingHandler={networkSettingHandler}
        setToggle={setToggle}
      />
      <NotDesktop>
        <SubMenu
          entry={entry}
          open={open}
          onClick={toggleMenuHandler}
          darkMode={themeMode === 'dark'}
          currentPath={router.route}
        />
      </NotDesktop>
    </Wrapper>
  );
};

const Wrapper = styled.div<EntryProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  position: relative;
  height: 80px;
  .svg-icon {
    fill: ${({entry}) => (entry ? theme.darkTheme.reverse : theme.lightTheme.reverse)};
  }
  .logo-icon {
    cursor: pointer;
    margin-right: ${({isDesktop}) => !isDesktop && 'auto'};
  }
  .sub-search {
    width: 396px;
    margin-left: 64px;
  }
`;

const Nav = styled.nav`
  ${mixins.flexbox('row', 'center', 'center')};
  margin-left: auto;
  gap: 40px;
  margin-right: 40px;

  .navigation-item {
    cursor: pointer;
  }
`;
