import React, { useCallback, useRef, useState } from "react";

import IconSearch from "@/assets/svgs/icon-nft-search.svg";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { useSearchResultNavigation } from "@/common/hooks/use-search-result-navigation";
import { useGetTransactionFunctionNames } from "@/common/react-query/transaction/api";
import { TransactionFunctionFilter } from "@/repositories/api/transaction/request";

import Text from "@/components/ui/text";
import { SearchResultWrapper } from "@/components/ui/search-result/SearchResultWrapper";
import * as ItemStyles from "@/components/ui/search-result/search-result-item/SearchResultItem.styles";
import { useListKeyword } from "@/components/view/list-summary/ListSearch";
import { SearchBox } from "@/components/view/list-summary/ListSummary.styles";
import * as S from "./TransactionFunctionSearch.styles";

// The API rejects function filter values over 256 characters.
const MAX_KEYWORD_LENGTH = 256;

interface TransactionFunctionSearchProps {
  /** Called with the filter to apply, or undefined to clear it. */
  onApply: (filter?: TransactionFunctionFilter) => void;
}

/**
 * Function filter input with label suggestions, like the explorer search.
 * Picking a suggestion filters by that exact label; Enter or the search button filters by the typed text.
 */
export const TransactionFunctionSearch = ({ onApply }: TransactionFunctionSearchProps) => {
  const { value, setValue, keyword } = useListKeyword();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const listRef = useOutSideClick(close);

  // Closed after a pick, the picked label changes the keyword without needing suggestions.
  const { data, isLoading } = useGetTransactionFunctionNames({ keyword }, { enabled: open && Boolean(keyword) });
  const names = data?.items ?? [];

  const text = value.trim();
  // The suggestions follow the debounced keyword, so they are stale while it lags behind the input.
  const isPending = isLoading || keyword !== (text || undefined);
  const isOpen = open && text !== "";

  const { onMouseMove, onMouseLeave } = useSearchResultNavigation({
    inputRef,
    listRef,
    open: isOpen,
    close,
    resetKey: data,
  });

  const onChange = (next: string) => {
    setValue(next);
    setOpen(true);
    if (!next.trim()) onApply(undefined);
  };

  const selectName = (name: string) => {
    setValue(name);
    setOpen(false);
    onApply({ function: name });
  };

  const submit = () => {
    setOpen(false);
    onApply(text ? { functionKeyword: text } : undefined);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter on a highlighted suggestion is handled by the navigation, which marks the event as prevented.
    if (event.key === "Enter" && !event.nativeEvent.defaultPrevented && !event.nativeEvent.isComposing) submit();
  };

  return (
    <S.Control>
      <SearchBox>
        <input
          ref={inputRef}
          type="search"
          aria-label="Search by function name"
          placeholder="Search by function name"
          maxLength={MAX_KEYWORD_LENGTH}
          value={value}
          onChange={event => onChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <S.SearchButton type="button" aria-label="Search" onClick={submit}>
          <IconSearch aria-hidden="true" />
        </S.SearchButton>
      </SearchBox>
      {isOpen && (
        <SearchResultWrapper ref={listRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          {isPending ? (
            <Text type="body1" color="tertiary">
              Loading...
            </Text>
          ) : names.length === 0 ? (
            <Text type="body1" color="tertiary">
              No match found
            </Text>
          ) : (
            <S.Section>
              <Text type="body1" color="tertiary">
                Functions
              </Text>
              <S.OptionList>
                {names.map(({ name }) => (
                  <ItemStyles.List key={name} data-search-option onClick={() => selectName(name)}>
                    <ItemStyles.FitContentAStyle>
                      <Text type="body1" color="primary" className="ellipsis">
                        {name}
                      </Text>
                    </ItemStyles.FitContentAStyle>
                  </ItemStyles.List>
                ))}
              </S.OptionList>
            </S.Section>
          )}
        </SearchResultWrapper>
      )}
    </S.Control>
  );
};
