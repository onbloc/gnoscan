import React, { RefObject, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useRecoilState } from "recoil";

import { searchState } from "@/states";
import { useRouter } from "@/common/hooks/common/use-router";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { useDebounce } from "@/common/hooks/use-debounce";
import { useSearchResultNavigation } from "@/common/hooks/use-search-result-navigation";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { useGetSearch } from "@/common/react-query/search/api/use-get-search";
import { SearchResult } from "@/repositories/api/search/response";
import { SEARCH_TYPE_TITLES } from "@/common/values/search.constant";

import mixins from "@/styles/mixins";
import Text from "@/components/ui/text";
import { SearchResultItem } from "./search-result-item/SearchResultItem";
import { SearchResultWrapper } from "./SearchResultWrapper";

const StandardNetworkSearchResult = ({ inputRef }: { inputRef: RefObject<HTMLInputElement> }) => {
  const { route } = useRouter();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useRecoilState(searchState);
  const debouncedKeyword = useDebounce(keyword, 300);
  const shouldSearch = debouncedKeyword.length > 0;

  const isMain = route === "/";
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutSideClick(close);

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

  const { onMouseMove, onMouseLeave } = useSearchResultNavigation({
    inputRef,
    listRef: ref,
    open,
    close,
    resetKey: searchResult,
  });

  const noResults = !searchResult || searchResult.length === 0;

  const handleClick = () => {
    setKeyword("");
  };

  return (
    <>
      {open && (
        <SearchResultWrapper isMain={isMain} ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
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
        </SearchResultWrapper>
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

export default StandardNetworkSearchResult;
