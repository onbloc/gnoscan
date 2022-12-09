'use client';

import {isDesktop} from '@/common/hooks/use-media';
import useSearchQuery from '@/common/hooks/use-search-query';
import {searchState} from '@/states';
import mixins from '@/styles/mixins';
import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import {v1} from 'uuid';
import {FitContentA} from '../detail-page-common-styles';
import Link from 'next/link';
import {useRouter} from 'next/router';
import useOutSideClick from '@/common/hooks/use-outside-click';

interface StyleProps {
  desktop?: boolean;
  isMain?: boolean;
  ref?: any;
}

const SearchResult = ({isMain}: {isMain: boolean}) => {
  const desktop = isDesktop();
  const value = useRecoilValue(searchState);
  const {result} = useSearchQuery();
  const {route} = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useOutSideClick(() => setOpen(false));

  useEffect(() => {
    setOpen(() => Boolean(value));
  }, [value]);

  useEffect(() => resetValue(), [route]);
  if (result) console.log(result);

  const resetValue = useCallback(() => setOpen(false), [value]);
  if (!value) return <></>;
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
                  {result[v].map((item: any, i: number) => (
                    <List key={v1()}>
                      {v === 'accounts' ? (
                        <Link href={`/accounts/${item.address}`} passHref>
                          <FitContentAStyle>
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
                          <FitContentA>
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
  z-index: 20;
  padding: 16px;
  overflow: auto;
  gap: 8px;
`;

const FitContentAStyle = styled(FitContentA)`
  ${mixins.flexbox('row', 'center', 'center')}
`;

export default SearchResult;
