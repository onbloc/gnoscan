'use client';

import {isDesktop} from '@/common/hooks/use-media';
import useSearchQuery from '@/common/hooks/use-search-query';
import {searchState} from '@/states';
import mixins from '@/styles/mixins';
import React, {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import {v1} from 'uuid';
import {FitContentA} from '../detail-page-common-styles';
import Link from 'next/link';
import {useRouter} from 'next/router';
import useOutSideClick from '@/common/hooks/use-outside-click';
import {zindex} from '@/common/values/z-index';
import {searchHistory} from '@/repositories/api/fetchers/api-search-history';

interface StyleProps {
  desktop?: boolean;
  isMain?: boolean;
  ref?: any;
}

interface NotRealmsObj {
  username: string;
  address: string;
}

const SearchResult = () => {
  const desktop = isDesktop();
  const [value, setValue] = useRecoilState(searchState);
  const {result} = useSearchQuery();
  const {route} = useRouter();
  const isMain = route === '/';
  const [open, setOpen] = useState(false);
  const ref = useOutSideClick(() => setOpen(false));

  useEffect(() => {
    setOpen(() => Boolean(value.length > 1));
  }, [result]);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const onClick = (v: string, item: any) => {
    const typeToLowercase = v.toLowerCase();
    const includesUsername = item?.username?.includes(value);
    if (typeToLowercase === 'realms') {
      searchHistory({
        keyword: value,
        type: 'pkg_path',
        value: item,
        memo1: '',
      });
    } else {
      searchHistory({
        keyword: value,
        type: includesUsername ? 'username' : 'address',
        value: includesUsername ? item.username : item.address,
        memo1: includesUsername ? item.address : '',
      });
    }
    setValue('');
  };

  return (
    <>
      {open && (
        <Wrapper desktop={desktop} isMain={isMain} ref={ref}>
          {Boolean(result) ? (
            Object.keys(result).map(v => (
              <Section key={v1()}>
                <Text type={isMain ? 'p4' : 'body1'} color="tertiary">
                  {v}
                </Text>
                <ListContainer>
                  {result[v].map((item: any) => (
                    <List key={v1()}>
                      {v === 'Accounts' ? (
                        <Link href={`/accounts/${item.address}`} passHref>
                          <FitContentAStyle onClick={() => onClick(v, item)}>
                            <Text
                              type={isMain ? 'p4' : 'body1'}
                              color="primary"
                              className="ellipsis">
                              {item.address}
                              {item.username && (
                                <Text
                                  type={isMain ? 'p4' : 'body1'}
                                  color="primary"
                                  display="inline-block">
                                  {` (${item.username})`}
                                </Text>
                              )}
                            </Text>
                          </FitContentAStyle>
                        </Link>
                      ) : (
                        <Link href={`/realms/details?path=${item}`} passHref>
                          <FitContentA onClick={() => onClick(v, item)}>
                            <Text
                              type={isMain ? 'p4' : 'body1'}
                              color="primary"
                              className="ellipsis">
                              {item}
                            </Text>
                          </FitContentA>
                        </Link>
                      )}
                    </List>
                  ))}
                </ListContainer>
              </Section>
            ))
          ) : (
            <Text type={isMain ? 'p4' : 'body1'} color="tertiary">
              No match found
            </Text>
          )}
        </Wrapper>
      )}
    </>
  );
};

// SearchResult.getInitialProps = async ({req}: any) => {
//   const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
//   return {ip};
// };

const commonContentStyle = css`
  ${mixins.flexbox('column', 'flex-start', 'center')};
  width: 100%;
  gap: 4px;
`;

const ListContainer = styled.ul`
  ${commonContentStyle}
`;

const List = styled.li`
  ${mixins.flexbox('row', 'center', 'flex-start')};
  width: 100%;
  border-radius: 4px;
  padding: 6px 10px;
  &:hover {
    background-color: ${({theme}) => theme.colors.dimmed50};
  }
`;

const Section = styled.section`
  ${commonContentStyle};
`;

const Wrapper = styled.div<StyleProps>`
  ${mixins.flexbox('column', 'center', 'flex-start')};
  width: ${({isMain}) => (isMain ? 'calc(100% - 20px)' : '100%')};
  max-height: 276px;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: ${({isMain}) => (isMain ? '93%' : 'calc(100% + 6px)')};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${zindex.searchResult};
  padding: 16px;
  overflow: auto;
  gap: 8px;
`;

const FitContentAStyle = styled(FitContentA)`
  ${mixins.flexbox('row', 'center', 'center')}
`;

export default SearchResult;
