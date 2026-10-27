import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { zindex } from "@/common/values/z-index";
import { FunctionNameModel } from "@/repositories/api/transaction/response";

const MAX_SUGGESTIONS = 8;

/** Candidates whose name contains the query regardless of case, most called first. */
export const matchFunctionNames = (functionNames: FunctionNameModel[], query: string): FunctionNameModel[] => {
  const needle = query.trim().toLowerCase();
  return functionNames.filter(({ name }) => name.toLowerCase().includes(needle)).slice(0, MAX_SUGGESTIONS);
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  functionNames: FunctionNameModel[];
}

/**
 * Function name input with a suggestion list styled like the header menus. Free text still
 * works; a suggestion only fills in the exact name. Closing on blur covers both clicking
 * elsewhere and tabbing away, and options keep the input focused while they are clicked.
 */
export const FunctionNameCombobox = ({ value, onChange, functionNames }: Props) => {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);

  const suggestions = React.useMemo(() => matchFunctionNames(functionNames, value), [functionNames, value]);
  const isOpen = open && suggestions.length > 0;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const select = (name: string) => {
    onChange(name);
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive(index => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(index => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && isOpen && active >= 0) {
      event.preventDefault();
      select(suggestions[active].name);
    } else if (event.key === "Escape") {
      close();
    }
  };

  return (
    <Wrapper>
      <input
        className="filter-input function-input"
        type="text"
        role="combobox"
        aria-label="Function"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen && active >= 0 ? `${listId}-${active}` : undefined}
        value={value}
        placeholder="Function name"
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={close}
        onChange={event => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
      />
      {isOpen && (
        <SuggestionList id={listId} role="listbox">
          {suggestions.map(({ name, count }, index) => (
            <li
              key={name}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? "active" : undefined}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(name)}
            >
              <Text type="p4" color="primary">
                {name}
              </Text>
              <Text type="p4" color="tertiary">
                {count.toLocaleString()} calls
              </Text>
            </li>
          ))}
        </SuggestionList>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

// Matches the header dropdown menus (top-nav DropdownList).
const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100%;
  width: max-content;
  max-width: 320px;
  margin: 0;
  padding: 8px;
  list-style: none;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  background-color: ${({ theme }) => theme.colors.surface};
  // Same layer as the header search results: above page content, below header menus.
  z-index: ${zindex.searchResult};

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &.active {
      background-color: ${({ theme }) => theme.colors.hover};
    }
  }
`;
