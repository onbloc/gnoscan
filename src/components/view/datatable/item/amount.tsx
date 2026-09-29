import { AmountText } from "@/components/ui/text/amount-text";
import { FontsType } from "@/styles";
import React from "react";

interface Props {
  value: string;
  denom: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const Amount = ({ value, denom, maxSize = "p4", minSize = "body1" }: Props) => {
  return <AmountText value={value} denom={denom} maxSize={maxSize} minSize={minSize} />;
};
