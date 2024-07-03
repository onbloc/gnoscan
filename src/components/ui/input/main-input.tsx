'use client';

import mixins from '@/styles/mixins';
import theme from '@/styles/theme';
import React, {useEffect} from 'react';
import styled from 'styled-components';
import Search from '@/assets/svgs/icon-search.svg';
import {isDesktop} from '@/common/hooks/use-media';
import SearchResult from '../search-result';
import {useRecoilState} from 'recoil';
import {searchState} from '@/states';
import {useRouter} from '@/common/hooks/common/use-router';

interface SubInputProps {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue?: () => void;
}

export const MainInput = ({className = '', onChange, clearValue}: SubInputProps) => {
  const desktop = isDesktop();
  const router = useRouter();
  const [value, setValue] = useRecoilState(searchState);

  useEffect(() => {
    clearValue && clearValue();
  }, [router.asPath]);

  const moveSearchPage = () => {
    const searchUrl = `/search?keyword=${value}`;
    router.push(searchUrl);
  };

  const onKeyDownInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      moveSearchPage();
      setValue('');
    }
  };

  const onClickSearchButton = () => {
    moveSearchPage();
  };

  return (
    <Wrapper isDesktop={desktop} className={className}>
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDownInput}
        type="text"
        placeholder="Search by Account / Block / Realm / Tokens"
      />
      <Button onClick={onClickSearchButton}>
        <Search className="search-icon" />
      </Button>
      <SearchResult />
    </Wrapper>
  );
};

const Wrapper = styled.div<{isDesktop: boolean}>`
  ${mixins.flexbox('row', 'center', 'space-between')};
  position: relative;
  background-color: ${theme.darkTheme.dimmed200};
  padding: 10px;
  border-radius: 17px;
  height: 68px;
  width: 100%;
  ${({isDesktop, theme}) => (isDesktop ? theme.fonts.p2 : theme.fonts.p4)};
  .search-icon {
    stroke: ${({theme}) => theme.colors.white};
  }
`;

const Button = styled.button`
  ${mixins.flexbox('row', 'center', 'center')};
  background-color: #2d262c;
  width: 48px;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
`;

const Input = styled.input`
  ${({theme}) => theme.fonts.p4};
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  background: #ffffff;
  flex-grow: 1;
  height: 100%;
  padding: 0px 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000000;
  ::placeholder {
    color: #c2c2c2;
  }
`;
