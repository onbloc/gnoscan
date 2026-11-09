import BigNumber from "bignumber.js";

/** Splits a signed change into the amount it brought in and the amount it took out, as integer strings. */
export const splitChange = (amount: string): { in: string; out: string } => {
  const value = new BigNumber(amount);
  if (value.isNaN()) {
    return { in: "0", out: "0" };
  }

  return value.isNegative() ? { in: "0", out: value.negated().toFixed() } : { in: value.toFixed(), out: "0" };
};
