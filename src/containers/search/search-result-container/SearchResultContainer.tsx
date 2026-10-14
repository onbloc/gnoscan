import React from "react";
import styled from "styled-components";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetSearch } from "@/common/react-query/search/api/use-get-search";
import { groupSearchResults } from "@/common/utils/search.utility";
import { media } from "@/common/values/ui.constant";
import { SEARCH_TYPE_TITLES } from "@/common/values/search.constant";
import { innerLayoutCss } from "@/styles/css/inner-layout";

import Text from "@/components/ui/text";
import { SearchResultItem } from "@/components/ui/search-result/search-result-item/SearchResultItem";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface SearchResultContainerProps {
  keyword: string;
}

const SearchResultContainer = ({ keyword }: SearchResultContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  const { data, isFetched } = useGetSearch(keyword, { enabled: !isCustomNetwork });

  // Custom networks have no search API, so only the redirects in `processSearchKeyword` apply there.
  if (isCustomNetwork || (isFetched && !data?.length)) {
    return <NotFound keyword={keyword} />;
  }

  return (
    <Container>
      <InnerLayout>
        <Wrapper>
          <PageTitle type="p2" desktopType="h2" title={`Search results for "${keyword}"`} />
          {!data ? (
            <Text type="body1" color="tertiary">
              Loading...
            </Text>
          ) : (
            groupSearchResults(data).map(group => (
              <Section key={group.type}>
                <Text type="body1" color="tertiary">
                  {SEARCH_TYPE_TITLES[group.type]}
                </Text>
                <ul>
                  {group.items.map(item => (
                    <SearchResultItem key={`${item.title}-${item.description}`} item={item} onClick={() => undefined} />
                  ))}
                </ul>
              </Section>
            ))
          )}
        </Wrapper>
      </InnerLayout>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  padding: 24px 0px;

  ${media.DESKTOP} {
    padding: 40px 16px;
  }
`;

const InnerLayout = styled.div`
  ${innerLayoutCss}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.surface};

  ${media.DESKTOP} {
    gap: 24px;
    padding: 24px;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default SearchResultContainer;
