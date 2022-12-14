'use client';

import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import styled from 'styled-components';
import mixins from '@/styles/mixins';
import {useRouter} from 'next/router';
import {TopNav, BtmNav} from '.';
import Text from '@/components/ui/text';
import GnoscanLogo from '@/assets/svgs/icon-gnoscan-logo.svg';
import {isDesktop} from '@/common/hooks/use-media';
export const Header = () => {
  const {route} = useRouter();
  const desktop = isDesktop();

  return (
    <>
      <Wrapper isMain={route === '/'} desktop={desktop}>
        <div className="inner-layout">
          <TopNav />
          <BtmNav />
          {/* {route === '/' ? (
            <Main isMain={route === '/'}>
              <Text type="h1" color="white">
                Main Header
              </Text>
            </Main>
          ) : (
            <Main isMain={route === '/'}>
              <Text type="h1" color="white">
                Sub Header
              </Text>
            </Main>
          )} */}
        </div>
      </Wrapper>
    </>
  );
};

const Main = styled.div<{isMain: boolean; desktop: boolean}>`
  width: 100%;
  height: ${({isMain}) => (isMain ? '256px' : '64px')};
  background: ${({isMain, theme}) =>
    isMain ? 'url("/bg-header.svg") no-repeat center center' : theme.colors.surface};
  box-shadow: ${({isMain}) => isMain && '0px 4px 4px rgba(0, 0, 0, 0.25)'};
  background-size: cover;
  h1 {
    font-size: 48px;
    color: #ffffff;
  }
`;

const Wrapper = styled.header<{isMain: boolean; desktop: boolean}>`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 100%;
  /* margin-bottom: ${({desktop}) => (desktop ? '48px' : '24px')}; */
  background: ${({isMain, theme}) =>
    isMain ? 'url("/bg-header.svg") no-repeat center center' : theme.colors.surface};
  box-shadow: ${({isMain}) => isMain && '0px 4px 4px rgba(0, 0, 0, 0.25)'};
  background-size: cover;
`;
