'use client';

import mixins from '@/styles/mixins';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import {MainInput, SubInput} from '@/components/ui/input';
import {isDesktop} from '@/common/hooks/use-media';

const Desktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.Desktop), {
  ssr: false,
});
const NotDesktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.NotDesktop), {
  ssr: false,
});

export const BtmNav = () => {
  const router = useRouter();
  const desktop = isDesktop();
  const entry = router.route === '/';
  const [value, setValue] = useState('');
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [value],
  );

  return (
    <>
      {entry ? (
        <Wrapper isMain={true}>
          <Desktop>
            <Text type="h1" color="white" textAlign="center">
              The Gnoland Blockchain Explorer
            </Text>
          </Desktop>
          <NotDesktop>
            <Text type="h2" color="white" textAlign="center">
              The Gnoland Blockchain Explorer
            </Text>
          </NotDesktop>
          <InputContainer desktop={desktop}>
            <MainInput value={value} onChange={onChange} />
            {/* <SearchResult desktop={desktop}>test</SearchResult> */}
          </InputContainer>
        </Wrapper>
      ) : (
        <NotDesktop>
          <Wrapper isMain={false}>
            <SubInput value={value} onChange={onChange} />
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
`;

const InputContainer = styled.div<{desktop: boolean}>`
  ${mixins.flexbox('column', 'center', 'center')};
  position: relative;
  width: 100%;
  max-width: ${({desktop}) => desktop && '910px'};
  margin-top: 14px;
`;

const SearchResult = styled.div<{desktop: boolean}>`
  max-width: ${({desktop}) => desktop && '890px'};
  height: 276px;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 64px;
  left: 10px;
  right: 10px;
  z-index: 10;
`;
