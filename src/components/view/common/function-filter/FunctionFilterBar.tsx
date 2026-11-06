import React from "react";

import { FunctionFilterValue } from "@/common/types/function-filter";

import { FunctionFilter } from "./FunctionFilter";
import * as S from "./FunctionFilter.styles";

interface FunctionFilterBarProps {
  filter: FunctionFilterValue;
  onChange: (filter: FunctionFilterValue) => void;
}

/** Filter button on its own row above the list of a detail page tab. */
export const FunctionFilterBar = ({ filter, onChange }: FunctionFilterBarProps) => (
  <S.Bar>
    <FunctionFilter filter={filter} onChange={onChange} />
  </S.Bar>
);
