import React, { useState } from "react";

import IconFilter from "@/assets/svgs/icon-filter.svg";
import { FunctionFilterValue } from "@/common/types/function-filter";

import { FunctionFilterModal } from "./FunctionFilterModal";
import * as S from "./FunctionFilter.styles";

interface FunctionFilterProps {
  filter: FunctionFilterValue;
  onChange: (filter: FunctionFilterValue) => void;
}

/** Filter button, with the count of listed labels, that opens the function filter modal. */
export const FunctionFilter = ({ filter, onChange }: FunctionFilterProps) => {
  const [open, setOpen] = useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  const count = filter.labels.length;

  return (
    <>
      <S.FilterButton
        type="button"
        aria-haspopup="dialog"
        aria-label={count > 0 ? `Filter, ${count} ${filter.mode === "exclude" ? "excluded" : "selected"}` : "Filter"}
        onClick={() => setOpen(true)}
      >
        <IconFilter aria-hidden="true" />
        {count > 0 && <S.Badge aria-hidden="true">{count}</S.Badge>}
      </S.FilterButton>
      {open && (
        <FunctionFilterModal
          filter={filter}
          onApply={next => {
            onChange(next);
            close();
          }}
          onClose={close}
        />
      )}
    </>
  );
};
