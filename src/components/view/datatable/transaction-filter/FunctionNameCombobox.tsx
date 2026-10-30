import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { zindex } from "@/common/values/z-index";
import { FunctionNameModel } from "@/repositories/api/transaction/response";

// ponytail: a plain capped list, virtualize it if the candidates ever need to go past this.
const MAX_SUGGESTIONS = 100;
// Keeps the list off the viewport edge.
const VIEWPORT_MARGIN = 16;
const LIST_MAX_WIDTH = 480;

/** Candidates whose name contains the query regardless of case, most called first. */
export const matchFunctionNames = (functionNames: FunctionNameModel[], query: string): FunctionNameModel[] => {
  const needle = query.trim().toLowerCase();
  return functionNames.filter(({ name }) => name.toLowerCase().includes(needle)).slice(0, MAX_SUGGESTIONS);
};

interface Props {
  value: string;
  // Realm of the picked suggestion, "" while the name is typed.
  packagePath: string;
  // packagePath is set only when a suggestion is picked.
  onChange: (name: string, packagePath?: string) => void;
  functionNames: FunctionNameModel[];
}

/**
 * Function name input with a suggestion list styled like the header menus. Free text matches
 * the name in every realm; a suggestion fills in the exact name and narrows to its realm. Closing on
 * blur covers both clicking elsewhere and tabbing away, and options keep the input focused while
 * they are clicked. The list scrolls, and opens leftward when it would run past the viewport.
 */
export const FunctionNameCombobox = ({ value, packagePath, onChange, functionNames }: Props) => {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const listRef = React.useRef<HTMLUListElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [listPosition, setListPosition] = React.useState<React.CSSProperties>({});

  const suggestions = React.useMemo(() => matchFunctionNames(functionNames, value), [functionNames, value]);
  const isOpen = open && suggestions.length > 0;

  // Placed from the input before the list renders: on mobile even one overflowing frame widens the page.
  const placeList = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const edge = document.documentElement.clientWidth - VIEWPORT_MARGIN;
    const fitsRight = edge - rect.left >= Math.min(LIST_MAX_WIDTH, edge - VIEWPORT_MARGIN);
    setListPosition(fitsRight ? { left: 0 } : { right: rect.right - edge });
  };

  React.useEffect(() => {
    if (active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const select = ({ name, packagePath }: FunctionNameModel) => {
    onChange(name, packagePath);
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
      select(suggestions[active]);
    } else if (event.key === "Escape") {
      close();
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
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
        onFocus={() => {
          placeList();
          setOpen(true);
        }}
        onBlur={close}
        onChange={event => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
      />
      {isOpen && (
        <SuggestionList ref={listRef} id={listId} role="listbox" style={listPosition}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}:${suggestion.packagePath}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? "active" : undefined}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(suggestion)}
            >
              <span className="suggestion-name">
                <Text type="p4" color="primary">
                  {suggestion.name}
                </Text>
                <Text type="p4" color="tertiary">
                  {suggestion.packagePath}
                </Text>
              </span>
              <Text type="p4" color="tertiary" className="suggestion-count">
                {suggestion.count.toLocaleString()} calls
              </Text>
            </li>
          ))}
        </SuggestionList>
      )}
      {packagePath && (
        <Text type="p4" color="tertiary" className="picked-realm">
          in {packagePath}
        </Text>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  .picked-realm {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// Matches the header dropdown menus (top-nav DropdownList).
const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100%;
  width: max-content;
  max-width: min(${LIST_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_MARGIN * 2}px));
  max-height: 360px;
  overflow-y: auto;
  overscroll-behavior: contain;
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

    .suggestion-name {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .suggestion-count {
      flex-shrink: 0;
      white-space: nowrap;
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.hover};
    }
  }
`;
