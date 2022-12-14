'use client';

import mixins from '@/styles/mixins';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import {MainInput, SubInput} from '@/components/ui/input';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import {searchState} from '@/states';
import {useRecoilState} from 'recoil';
import {debounce} from '@/common/utils/string-util';
import dynamic from 'next/dynamic';

const Desktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.Desktop), {
  ssr: false,
});
const NotDesktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.NotDesktop), {
  ssr: false,
});

export const BtmNav = () => {
  const {route} = useRouter();
  const desktop = isDesktop();
  const [value, setValue] = useRecoilState(searchState);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(setValue(e.target.value), 1000);
    },
    [value],
  );

  const clearValue = () => {
    setValue('');
  };

  return (
    <>
      {route === '/' ? (
        <Wrapper isMain={route === '/'}>
          <Text type={desktop ? 'h1' : 'h2'} color="white">
            The Gnoland Blockchain Explorer
          </Text>
          <MainInput
            className="main-search"
            value={value}
            onChange={onChange}
            clearValue={clearValue}
          />
        </Wrapper>
      ) : (
        <NotDesktop>
          <Wrapper isMain={route === '/'}>
            <SubInput value={value} onChange={onChange} clearValue={clearValue} />
          </Wrapper>
        </NotDesktop>
      )}
    </>
  );
};

const Wrapper = styled.div<{isMain: boolean}>`
  ${mixins.flexbox('column', 'center', 'center')};
  position: relative;
  height: ${({isMain}) => (isMain ? '256px' : '64px')};
  padding: ${({isMain}) => !isMain && '8px 0px 16px'};
  width: 100%;
  .main-search {
    width: 100%;
    max-width: 910px;
    margin-top: 14px;
  }
`;
