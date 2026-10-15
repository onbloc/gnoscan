/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSearchQuery from "@/common/hooks/use-search-query";
import { searchState } from "@/states";
import mixins from "@/styles/mixins";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { css } from "styled-components";
import Text from "@/components/ui/text";
import { v1 } from "uuid";
import { FitContentSpan } from "../detail-page-common-styles";
import Link from "next/link";
import { useRouter } from "@/common/hooks/common/use-router";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { zindex } from "@/common/values/z-index";
import { ValuesType } from "utility-types";
import { useNetwork } from "@/common/hooks/use-network";
import { FontsType } from "@/styles";

interface SearchResultProps {
  item: any;
  textType: FontsType;
  searchTitle: SEARCH_TITLE;
  onClick: (v: SEARCH_TITLE, item: any) => void;
}

export const SEARCH_TITLE = {
  ACCOUNTS: "Accounts",
  REALMS: "Realms",
  TOKENS: "Tokens",
} as const;
export type SEARCH_TITLE = ValuesType<typeof SEARCH_TITLE>;

const SearchResult = ({ isMain = false }: { isMain?: boolean }) => {
  const [keyword, setKeyword] = useRecoilState(searchState);
  const { route } = useRouter();
  const textType = isMain ? "p4" : "body1";
  const [open, setOpen] = useState(false);
  const ref = useOutSideClick<HTMLDivElement>(() => setOpen(false));

  const { result } = useSearchQuery(keyword);

  useEffect(() => {
    setOpen(() => Boolean(keyword.length > 1));
  }, [keyword]);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const onClick = (v: string, item: any) => {
    setKeyword("");
  };

  return (
    <>
      {open && (
        <Wrapper $isMain={isMain} ref={ref}>
          {result && Object.keys(result).length !== 0 ? (
            Object.keys(result).map(searchTitle => (
              <Section key={v1()}>
                <Text type={textType} color="tertiary">
                  {searchTitle}
                </Text>
                <ListContainer>
                  {result[searchTitle].map((item: any) => (
                    <List key={v1()}>
                      {searchTitle === SEARCH_TITLE.ACCOUNTS && (
                        <AccountsList item={item} textType={textType} searchTitle={searchTitle} onClick={onClick} />
                      )}
                      {searchTitle === SEARCH_TITLE.REALMS && (
                        <RealmsList item={item} textType={textType} searchTitle={searchTitle} onClick={onClick} />
                      )}
                      {searchTitle === SEARCH_TITLE.TOKENS && (
                        <TokensList item={item} textType={textType} searchTitle={searchTitle} onClick={onClick} />
                      )}
                    </List>
                  ))}
                </ListContainer>
              </Section>
            ))
          ) : (
            <Text type={textType} color="tertiary">
              No match found
            </Text>
          )}
        </Wrapper>
      )}
    </>
  );
};

const AccountsList = ({ item, textType, searchTitle, onClick }: SearchResultProps) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/account/${item.address}`)} passHref>
      <FitContentAStyle onClick={() => onClick(searchTitle, item)}>
        <Text type={textType} color="primary" className="ellipsis">
          {item.address}
          {item.username && (
            <Text type={textType} color="primary" display="inline-block">
              {` (${item.username})`}
            </Text>
          )}
        </Text>
      </FitContentAStyle>
    </Link>
  );
};

const RealmsList = ({ item, textType, searchTitle, onClick }: SearchResultProps) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/realms/details?path=${item.packagePath}`)} passHref>
      <FitContentSpan onClick={() => onClick(searchTitle, item)}>
        <Text type={textType} color="primary" className="ellipsis">
          {item.packagePath}
        </Text>
      </FitContentSpan>
    </Link>
  );
};

const TokensList = ({ item, textType, searchTitle, onClick }: SearchResultProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const tokenKey = item.symbol ? `${item.packagePath}.${item.symbol}` : item.packagePath;

  return (
    <Link href={getUrlWithNetwork(`/tokens/${tokenKey}`)} passHref>
      <FitContentAStyle onClick={() => onClick(searchTitle, item)}>
        <Text type={textType} color="primary" className="ellipsis">
          {item.name}
          <Text type={textType} color="primary" display="inline-block">
            {` (${item.packagePath})`}
          </Text>
        </Text>
      </FitContentAStyle>
    </Link>
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

const List = styled.li`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  border-radius: 4px;
  padding: 6px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.dimmed50};
  }
`;

const Section = styled.section`
  ${commonContentStyle};
`;

const Wrapper = styled.div<{ $isMain: boolean }>`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: ${({ $isMain }) => ($isMain ? "calc(100% - 20px)" : "100%")};
  max-height: 276px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: ${({ $isMain }) => ($isMain ? "93%" : "calc(100% + 6px)")};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${zindex.searchResult};
  padding: 16px;
  overflow: auto;
  gap: 8px;
`;

const FitContentAStyle = styled(FitContentSpan)`
  ${mixins.flexbox("row", "center", "center")}
`;

export default SearchResult;
