'use client';

import mixins from '@/styles/mixins';
import theme from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';
import Search from '@/assets/svgs/icon-search.svg';
import {isDesktop} from '@/common/hooks/use-media';
import SearchResult from '../search-result';

interface SubInputProps {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MainInput = ({className = '', value, onChange}: SubInputProps) => {
  const desktop = isDesktop();
  return (
    <Wrapper isDesktop={desktop} className={className}>
      <Input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="Search by Account / Block / Realm / Tokens"
      />
      <Button>
        <Search className="search-icon" />
      </Button>
      <SearchResult isMain={true} />
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
  cursor: default;
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
