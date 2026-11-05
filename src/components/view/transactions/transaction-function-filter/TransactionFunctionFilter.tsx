import React, { useState } from "react";

import IconFilter from "@/assets/svgs/icon-filter.svg";
import { TransactionFunctionFilterValue } from "@/repositories/api/transaction/request";

import { TransactionFunctionFilterModal } from "./TransactionFunctionFilterModal";
import * as S from "./TransactionFunctionFilter.styles";

interface TransactionFunctionFilterProps {
  filter: TransactionFunctionFilterValue;
  onChange: (filter: TransactionFunctionFilterValue) => void;
}

/** Filter button, with the count of listed labels, that opens the function filter modal. */
export const TransactionFunctionFilter = ({ filter, onChange }: TransactionFunctionFilterProps) => {
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
        <TransactionFunctionFilterModal
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
