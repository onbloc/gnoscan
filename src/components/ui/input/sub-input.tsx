import React, {useEffect} from 'react';
import styled from 'styled-components';
import Search from '@/assets/svgs/icon-search.svg';
import mixins from '@/styles/mixins';
import SearchResult from '../search-result';
import theme from '@/styles/theme';
import {useRouter} from 'next/router';

interface SubInputProps {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue?: () => void;
}

export const SubInput = ({className = '', value, onChange, clearValue}: SubInputProps) => {
  const router = useRouter();

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
    }
  };

  const onClickSearchButton = () => {
    moveSearchPage();
  };

  return (
    <Wrapper className={className}>
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

const Wrapper = styled.div`
  ${mixins.flexbox('row', 'center', 'center')};
  position: relative;
  background-color: ${({theme}) => theme.colors.base};
  border-radius: 8px;
  height: 40px;
  width: 100%;
  .search-icon {
    stroke: ${({theme}) => theme.colors.primary};
  }
`;

const Button = styled.button`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 48px;
  height: 100%;
  background-color: inherit;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
`;

const Input = styled.input`
  ${({theme}) => theme.fonts.p4};
  flex-grow: 1;
  height: 100%;
  padding-left: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({theme}) => theme.colors.reverse};
  &:placeholder {
    color: ${({theme}) => theme.colors.tertiary};
  }
`;
