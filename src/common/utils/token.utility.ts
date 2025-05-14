import BigNumber from "bignumber.js";

export function parseTokenAmount(tokenAmount: string, denomination = "ugnot"): number {
  const pattern = new RegExp(`^(\\d+)${denomination}$`);
  const match = tokenAmount.match(pattern);

  return match ? parseInt(match[1], 10) : 0;
}

export function formatTokenDecimal(amount: string | number, decimals = 6): string {
  const amountToBigNumber = new BigNumber(amount);

  if (amountToBigNumber.isNaN() || !amountToBigNumber.isFinite()) {
    return "0";
  }

  return amountToBigNumber.shiftedBy(-decimals).toString(10);
}
