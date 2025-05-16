/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useRecoilState } from "recoil";

import { searchState } from "@/states";
import { useRouter } from "@/common/hooks/common/use-router";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { useDebounce } from "@/common/hooks/use-debounce";
import { ValuesType } from "utility-types";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { useGetSearch } from "@/common/react-query/search/api/use-get-search";
import { SearchResult } from "@/repositories/api/search/response";

import mixins from "@/styles/mixins";
import { zindex } from "@/common/values/z-index";
import Text from "@/components/ui/text";
import { SearchResultItem } from "./search-result-item/SearchResultItem";

interface StyleProps {
  desktop?: boolean;
  isMain?: boolean;
  ref?: any;
}

export const SEARCH_TITLE = {
  ACCOUNTS: "Accounts",
  REALMS: "Realms",
  TOKENS: "Tokens",
} as const;
export type SEARCH_TITLE = ValuesType<typeof SEARCH_TITLE>;

const SEARCH_TYPE_TITLES = {
  [SEARCH_RESULT_TYPE.ACCOUNT]: "Accounts",
  [SEARCH_RESULT_TYPE.BLOCK]: "Blocks",
  [SEARCH_RESULT_TYPE.TOKEN]: "Tokens",
  [SEARCH_RESULT_TYPE.PROPOSAL]: "Proposals",
  [SEARCH_RESULT_TYPE.REALM]: "Realms",
  [SEARCH_RESULT_TYPE.TRANSACTION]: "Transactions",
} as const;

const StandardNetworkSearchResult = () => {
  const { route } = useRouter();
  const { isDesktop } = useWindowSize();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useRecoilState(searchState);
  const debouncedKeyword = useDebounce(keyword, 300);
  const shouldSearch = debouncedKeyword.length > 0;

  const isMain = route === "/";
  const ref = useOutSideClick(() => setOpen(false));

  const { data: searchResult, isLoading: isLoadingSearch } = useGetSearch(debouncedKeyword, {
    enabled: shouldSearch,
  });

  const groupedSearchResult = React.useMemo(() => {
    if (!searchResult) return [];

    return Object.values(
      searchResult.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = {
            type: item.type,
            items: [],
          };
        }
        acc[item.type].items.push(item);
        return acc;
      }, {} as Record<SEARCH_RESULT_TYPE, { type: SEARCH_RESULT_TYPE; items: SearchResult[] }>),
    );
  }, [searchResult]);

  useEffect(() => {
    setOpen(() => Boolean(debouncedKeyword.length > 0));
  }, [debouncedKeyword]);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const noResults = !searchResult || searchResult.length === 0;

  const handleClick = () => {
    setKeyword("");
  };

  return (
    <>
      {open && (
        <Wrapper desktop={isDesktop} isMain={isMain} ref={ref}>
          {isLoadingSearch ? (
            <Text type={isMain ? "p4" : "body1"} color="tertiary">
              Loading...
            </Text>
          ) : noResults ? (
            <Text type={isMain ? "p4" : "body1"} color="tertiary">
              No match found
            </Text>
          ) : (
            groupedSearchResult.map(group => (
              <Section key={group.type}>
                <Text type={isMain ? "p4" : "body1"} color="tertiary">
                  {SEARCH_TYPE_TITLES[group.type as SEARCH_RESULT_TYPE]}
                </Text>
                <ListContainer>
                  {group.items.map(item => (
                    <SearchResultItem key={item.title} item={item} isMain={isMain} onClick={handleClick} />
                  ))}
                </ListContainer>
              </Section>
            ))
          )}
        </Wrapper>
      )}
    </>
  );
};

const commonContentStyle = css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 4px;
`;

const ListContainer = styled.ul`
  ${commonContentStyle}
`;

const Section = styled.section`
  ${commonContentStyle};
`;

const Wrapper = styled.div<StyleProps>`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: ${({ isMain }) => (isMain ? "calc(100% - 20px)" : "100%")};
  max-height: 276px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: ${({ isMain }) => (isMain ? "93%" : "calc(100% + 6px)")};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${zindex.searchResult};
  padding: 16px;
  overflow: auto;
  gap: 8px;
`;
export default StandardNetworkSearchResult;
