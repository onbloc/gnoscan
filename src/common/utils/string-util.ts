import BigNumber from 'bignumber.js';

export function textEllipsis(value: string, num?: number): string {
  const length = num ?? 4;
  return value.length < 10 ? value : `${value.slice(0, length)}...${value.slice(-length)}`;
}

export const debounce = (callback: any, duration: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (v: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(v), duration);
  };
};

export const firstStrUpperCase = (v: string) => {
  return v.replace(/^[a-z]/, char => char.toUpperCase());
};

export function makeDisplayNumber(amount: string | number): string {
  return BigNumber(amount).toFormat();
}

export function makeDisplayTokenAmount(amount: string | number, decimals = 6): string {
  return BigNumber(amount)
    .shiftedBy(decimals * -1)
    .toFormat();
}

export function makeDisplayNumberWithDefault(
  value: string | number | null | undefined,
  defaultValue = '-',
) {
  console.log(value);
  if (value === null || value === undefined || BigNumber(value).isNaN()) {
    return defaultValue;
  }

  return makeDisplayNumber(value);
}
