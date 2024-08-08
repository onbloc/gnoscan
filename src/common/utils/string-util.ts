import BigNumber from 'bignumber.js';
import {isBech32Address} from './bech32.utility';

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
  if (value === null || value === undefined || BigNumber(value).isNaN()) {
    return defaultValue;
  }

  return makeDisplayNumber(value);
}

export function toString(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toString();
}

export function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  const bn = BigNumber(value);
  if (bn.isNaN()) {
    return 0;
  }

  return bn.toNumber();
}

export function makeQueryString(params: {[key in string]: string} | null) {
  if (!params) {
    return '';
  }

  return Object.entries(params)
    .map(entry => `${entry[0]}=${entry[1]}`)
    .join('&');
}

export function formatDisplayPackagePath(packagePath: string | null | undefined): string {
  if (!packagePath) {
    return '';
  }

  const elements = packagePath.split('/');
  return elements
    .map(element => (isBech32Address(element) ? textEllipsis(element, 4) : element))
    .join('/');
}
