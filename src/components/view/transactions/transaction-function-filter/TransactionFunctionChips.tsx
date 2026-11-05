import React from "react";

import { TransactionFunctionFilterValue } from "@/repositories/api/transaction/request";
import { removeFunctionLabel } from "@/common/utils/transaction-function-filter.utility";

import * as S from "./TransactionFunctionFilter.styles";

interface TransactionFunctionChipsProps {
  /** Applied filter; renders nothing while it lists every transaction. */
  filter: TransactionFunctionFilterValue;
  onChange: (filter: TransactionFunctionFilterValue) => void;
}

/** The labels of the applied filter as removable chips. */
export const TransactionFunctionChips = ({ filter, onChange }: TransactionFunctionChipsProps) => {
  if (filter.labels.length === 0) return null;

  const isExclude = filter.mode === "exclude";

  return (
    <S.Applied role="group" aria-label={isExclude ? "Excluded functions" : "Selected functions"}>
      {filter.labels.map(label => (
        <S.Chip key={label} $excluded={isExclude}>
          {isExclude && <S.ExcludeMark aria-hidden="true" />}
          <span>{label}</span>
          <S.ChipRemove
            type="button"
            aria-label={`Remove ${label}`}
            onClick={() => onChange(removeFunctionLabel(filter, label))}
          >
            <span aria-hidden="true">&times;</span>
          </S.ChipRemove>
        </S.Chip>
      ))}
    </S.Applied>
  );
};
