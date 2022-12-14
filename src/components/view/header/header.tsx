'use client';

import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import styled from 'styled-components';
import mixins from '@/styles/mixins';
import {useRouter} from 'next/router';
import {TopNav, BtmNav} from '.';

export const Header = () => {
  const {route} = useRouter();

  return (
    <>
      <Wrapper isMain={route === '/'}>
        <div className="inner-layout">
          <TopNav />
          <BtmNav />
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.header<{isMain: boolean}>`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 100%;
  background: ${({isMain, theme}) =>
    isMain ? 'url("/bg-header.svg") no-repeat center center' : theme.colors.surface};
  box-shadow: ${({isMain}) => isMain && '0px 4px 4px rgba(0, 0, 0, 0.25)'};
  background-size: cover;
`;
