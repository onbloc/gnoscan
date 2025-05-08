/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { useRecoilState } from "recoil";
import { v1 } from "uuid";

import { searchState } from "@/states";
import { useRouter } from "@/common/hooks/common/use-router";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetSearchAutocomplete } from "@/common/react-query/search/api/use-get-search-autocomplete";
import { useDebounce } from "@/common/hooks/use-debounce";
import { ValuesType } from "utility-types";

import mixins from "@/styles/mixins";
import { zindex } from "@/common/values/z-index";
import Text from "@/components/ui/text";
import { FitContentA } from "../detail-page-common-styles";
import { useWindowSize } from "@/common/hooks/use-window-size";

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

const StandardNetworkSearchResult = () => {
  const { route } = useRouter();
  const { isDesktop } = useWindowSize();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useRecoilState(searchState);
  const debouncedKeyword = useDebounce(keyword, 300);
  const shouldSearch = debouncedKeyword.length > 1;

  const isMain = route === "/";
  const ref = useOutSideClick(() => setOpen(false));

  const { data, isLoading } = useGetSearchAutocomplete(debouncedKeyword, {
    enabled: shouldSearch,
  });

  useEffect(() => {
    setOpen(() => Boolean(debouncedKeyword.length > 1));
  }, [debouncedKeyword]);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  const noResults = !data || !data.path || data.path.length === 0;

  const handleClick = () => {
    setKeyword("");
  };

  return (
    <>
      {open && (
        <Wrapper desktop={isDesktop} isMain={isMain} ref={ref}>
          {isLoading ? (
            <Text type={isMain ? "p4" : "body1"} color="tertiary">
              Loading...
            </Text>
          ) : noResults ? (
            <Text type={isMain ? "p4" : "body1"} color="tertiary">
              No match found
            </Text>
          ) : (
            <Section key={v1()}>
              <Text type={isMain ? "p4" : "body1"} color="tertiary">
                {data.type === "Realms"
                  ? "Realms"
                  : data.type === "Accounts"
                  ? "Accounts"
                  : data.type === "Tokens"
                  ? "Tokens"
                  : "Results"}
              </Text>
              <ListContainer>
                {data.path?.map(path => (
                  <List key={v1()}>
                    {data.type === "Realms" && <RealmsListItem path={path} isMain={isMain} onClick={handleClick} />}
                    {data.type === "Accounts" && (
                      <AccountsListItem address={path} isMain={isMain} onClick={handleClick} />
                    )}
                    {data.type === "Tokens" && <TokensListItem path={path} isMain={isMain} onClick={handleClick} />}
                  </List>
                ))}
              </ListContainer>
            </Section>
          )}
        </Wrapper>
      )}
    </>
  );
};

interface ListItemProps {
  isMain: boolean;
  onClick: () => void;
}

interface AccountsListItemProps extends ListItemProps {
  address: string;
}

const AccountsListItem = ({ address, isMain, onClick }: AccountsListItemProps) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/account/${address}`)} passHref>
      <FitContentAStyle onClick={onClick}>
        <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
          {address}
        </Text>
      </FitContentAStyle>
    </Link>
  );
};

interface RealmsListItemProps extends ListItemProps {
  path: string;
}

const RealmsListItem = ({ path, isMain, onClick }: RealmsListItemProps) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/realms/details?path=${path}`)} passHref>
      <FitContentA onClick={onClick}>
        <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
          {path}
        </Text>
      </FitContentA>
    </Link>
  );
};

interface TokensListItemProps extends ListItemProps {
  path: string;
}

const TokensListItem = ({ path, isMain, onClick }: TokensListItemProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const name = path.split("/").pop() || path;

  return (
    <Link href={getUrlWithNetwork(`/tokens/${path}`)} passHref>
      <FitContentAStyle onClick={onClick}>
        <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
          {name}
          <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
            {` (${path})`}
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

const FitContentAStyle = styled(FitContentA)`
  ${mixins.flexbox("row", "center", "center")}
`;

export default StandardNetworkSearchResult;
