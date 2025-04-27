/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { parseSearchString, processSearchKeyword } from "@/common/utils/search.utility";

import SearchLayout from "@/layouts/search/SearchLayout";
import SearchResultContainer from "@/containers/search/search-result-container/SearchResultContainer";

interface PageProps {
  keyword: string;
  redirectUrl: string;
}

export async function getServerSideProps({ req }: any) {
  const params = parseSearchString(req.url);
  const keyword = params?.keyword;

  if (!keyword) {
    return {
      props: {
        keyword: "",
        redirectUrl: null,
      },
    };
  }

  try {
    const redirectResult = processSearchKeyword(keyword, params);
    if (redirectResult) {
      return {
        redirect: redirectResult,
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      keyword,
      redirectUrl: null,
    },
  };
}

export default function Page({ keyword }: PageProps) {
  return (
    <>
      <SearchLayout searchResult={<SearchResultContainer keyword={keyword} />} />
    </>
  );
}
