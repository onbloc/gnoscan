import React from "react";

import IconSearch from "@/assets/svgs/icon-nft-search.svg";
import { useDebounce } from "@/common/hooks/use-debounce";
import * as S from "./ListSummary.styles";

const SEARCH_DEBOUNCE_MS = 300;

/** Input state plus the debounced keyword to send with the list request, undefined when empty. */
export const useListKeyword = () => {
  const [value, setValue] = React.useState("");
  const keyword = useDebounce(value.trim(), SEARCH_DEBOUNCE_MS) || undefined;
  return { value, setValue, keyword };
};

interface ListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const ListSearch = ({ value, onChange, placeholder }: ListSearchProps) => (
  <S.SearchBox>
    <input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={event => onChange(event.target.value)}
    />
    <IconSearch aria-hidden="true" />
  </S.SearchBox>
);
