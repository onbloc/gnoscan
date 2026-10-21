import React from "react";

import NotFound from "@/components/view/search/not-found/NotFound";

interface SearchResultContainerProps {
  keyword: string;
}

const SearchResultContainer = ({ keyword }: SearchResultContainerProps) => {
  return <NotFound keyword={keyword} />;
};

export default SearchResultContainer;
