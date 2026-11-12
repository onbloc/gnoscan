import React, { useRef, useState } from "react";

import IconClose from "@/assets/svgs/icon-close.svg";
import IconSearch from "@/assets/svgs/icon-nft-search.svg";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import { zindex } from "@/common/values/z-index";
import { useBodyScrollLock } from "@/common/hooks/common/use-body-scroll-lock";
import { useModalFocus } from "@/common/hooks/common/use-modal-focus";
import { useGetTransactionFunctionNames } from "@/common/react-query/transaction/api";
import { FunctionFilterValue } from "@/common/types/function-filter";
import { MAX_FUNCTION_LABELS } from "@/common/values/function-filter.constant";
import {
  canToggleFunction,
  isFunctionChecked,
  removeFunctionLabel,
  setAllFunctionsChecked,
  setFunctionChecked,
} from "@/common/utils/function-filter.utility";

import Portal from "@/components/core/portal";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import { useListKeyword } from "@/components/view/list-summary/ListSearch";
import * as S from "./FunctionFilter.styles";

interface FunctionFilterModalProps {
  /** Filter applied to the list now. */
  filter: FunctionFilterValue;
  onApply: (filter: FunctionFilterValue) => void;
  onClose: () => void;
}

const ALL_TOOLTIP = "The list shows the top 20 most called functions. Search to find the others not on the list.";

const FilterDialog = ({ filter, onApply, onClose }: FunctionFilterModalProps) => {
  const [draft, setDraft] = useState(filter);
  const { value, setValue, keyword } = useListKeyword();
  const searchRef = useRef<HTMLInputElement>(null);

  // Without a keyword the API lists the most used labels. The previous list stays while a new search loads.
  const { data, isLoading, isError } = useGetTransactionFunctionNames({ keyword }, { keepPreviousData: true });
  const names = data?.items.map(item => item.name) ?? [];

  const isExclude = draft.mode === "exclude";
  const isAll = isExclude && draft.labels.length === 0;
  const isAtLimit = draft.labels.length >= MAX_FUNCTION_LABELS;
  // Follows the debounced keyword, so "All" hides together with the unfiltered list it belongs to.
  const isSearching = keyword !== undefined;

  useBodyScrollLock(true);

  useModalFocus(onClose, searchRef);

  const toggle = (name: string, checked: boolean) => setDraft(current => setFunctionChecked(current, name, checked));

  return (
    <S.Overlay onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <S.Dialog role="dialog" aria-modal="true" aria-label="Function filter">
        <S.Header>
          <Text type="h5" color="primary">
            Function Filter
          </Text>
          <S.CloseButton type="button" aria-label="Close" onClick={onClose}>
            <IconClose aria-hidden="true" />
          </S.CloseButton>
        </S.Header>

        <S.Body>
          <S.SearchBox>
            <IconSearch aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              aria-label="Search functions"
              placeholder="Search"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </S.SearchBox>

          {draft.labels.length > 0 && (
            <S.SelectedBox role="group" aria-label={isExclude ? "Excluded functions" : "Selected functions"}>
              {draft.labels.map(name => (
                <S.Chip key={name} $excluded={isExclude}>
                  {isExclude && <S.ExcludeMark aria-hidden="true" />}
                  <S.ChipName>{name}</S.ChipName>
                  <S.ChipRemove
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() => setDraft(current => removeFunctionLabel(current, name))}
                  >
                    <span aria-hidden="true">&times;</span>
                  </S.ChipRemove>
                </S.Chip>
              ))}
            </S.SelectedBox>
          )}

          <S.OptionList aria-label="Functions">
            {!isSearching && (
              <>
                <li>
                  <S.Option>
                    <input
                      type="checkbox"
                      checked={isAll}
                      // Some labels are unchecked: checking All checks them all again.
                      ref={element => {
                        if (element) element.indeterminate = isExclude && !isAll;
                      }}
                      onChange={() => setDraft(setAllFunctionsChecked(!isAll))}
                    />
                    <span>All</span>
                    {/* Inside the label, a click on the icon would toggle All. */}
                    <S.InfoIcon onClick={event => event.preventDefault()}>
                      <Tooltip content={ALL_TOOLTIP} width={240} zIndex={zindex.modalTooltip}>
                        <IconTooltip aria-hidden="true" />
                      </Tooltip>
                    </S.InfoIcon>
                  </S.Option>
                </li>
                <S.Divider role="separator" />
              </>
            )}
            {isLoading ? (
              <S.ListLabel as="li">Loading...</S.ListLabel>
            ) : isError && names.length === 0 ? (
              <S.ListLabel as="li">Failed to load functions. Try again later.</S.ListLabel>
            ) : names.length === 0 ? (
              <S.ListLabel as="li">No match found</S.ListLabel>
            ) : (
              names.map(name => {
                const checked = isFunctionChecked(draft, name);
                const disabled = !canToggleFunction(draft, name);
                return (
                  <li key={name}>
                    <S.Option $disabled={disabled}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={event => toggle(name, event.target.checked)}
                      />
                      <span>{name}</span>
                    </S.Option>
                  </li>
                );
              })
            )}
          </S.OptionList>

          {isAtLimit && (
            <S.ListLabel>
              Up to {MAX_FUNCTION_LABELS} functions can be {isExclude ? "excluded" : "selected"}.
            </S.ListLabel>
          )}
        </S.Body>

        <S.Footer>
          <S.Actions>
            <S.ClearButton type="button" onClick={() => setDraft(setAllFunctionsChecked(false))}>
              Clear
            </S.ClearButton>
            <S.ApplyButton type="button" onClick={() => onApply(draft)}>
              OK
            </S.ApplyButton>
          </S.Actions>
        </S.Footer>
      </S.Dialog>
    </S.Overlay>
  );
};

/**
 * Picks the function labels to filter the transaction list by.
 * Labels come from the function name suggestions and are kept apart from them, so a search never drops a check.
 * Nothing changes in the list until OK; closing the modal discards the picks.
 */
export const FunctionFilterModal = (props: FunctionFilterModalProps) => (
  // The dialog mounts once the portal target is found, so its focus handling runs inside the portal.
  <Portal selector="modal-root">
    <FilterDialog {...props} />
  </Portal>
);
