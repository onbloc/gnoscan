import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";

import NotFound from "@/components/view/search/not-found/NotFound";

interface SearchResultContainerProps {
  keyword: string;
}

const SearchResultContainer = ({ keyword }: SearchResultContainerProps) => {
  const { breakpoint } = useWindowSize();

  return <NotFound keyword={keyword} breakpoint={breakpoint} />;
};

export default SearchResultContainer;
