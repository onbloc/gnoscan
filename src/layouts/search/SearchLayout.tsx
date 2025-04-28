import React from "react";

import * as S from "./SearchLayout.styles";

interface SearchLayoutProps {
  searchResult: React.ReactNode;
}

const SearchLayout = ({ searchResult }: SearchLayoutProps) => {
  return <S.Container>{searchResult}</S.Container>;
};

export default SearchLayout;
