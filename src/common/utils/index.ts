import {PaletteKeyType} from '@/styles/theme';
import BigNumber from 'bignumber.js';

export type StatusKeyType = 'success' | 'failure';
export interface StatusResultType {
  status: string;
  color: PaletteKeyType;
}

export const numberWithFixedCommas = (v: string | number | BigNumber, fixed?: number): string => {
  const fix = fixed ?? 6;
  const bigNum = BigNumber(v);
  const integerCheck = Number.isInteger(Number(bigNum));
  if (integerCheck) {
    return numberWithCommas(v);
  } else {
    const split = bigNum.toString().split('.');
    const commasNum = numberWithCommas(split[0]);
    const fixedNum = decimalFixed(split[1], fix);
    return `${commasNum}.${fixedNum}`;
  }
};

export const decimalFixed = (v: string | number, fixed: number) => {
  const bigNum = BigNumber(v);
  return String(bigNum).slice(0, fixed);
};

export const numberWithCommas = (v: string | number | BigNumber) => {
  if (!Boolean(v)) return '0';
  const bigNum = BigNumber(v);
  return bigNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function formatAddress(v: string, num: number = 4): string {
  return v.length < 40 ? v : `${v.slice(0, num)}...${v.slice(-num)}`;
}

export function formatEllipsis(v: string, num: number = 11) {
  return v.length > num ? `${v.slice(0, num)}..` : v;
}

export const decimalPointWithCommas = (v: number | string, fixed?: number): string[] | string => {
  if (!Boolean(v)) return ['0'];
  const fix = fixed ?? 6;
  const splitDot = v.toString().split('.');

  if (splitDot.length > 1) {
    return [...numberWithCommas(splitDot[0]), splitDot[1]];
  } else {
    return [numberWithCommas(splitDot[0])];
  }
};

export const statusObj = (status: StatusKeyType): StatusResultType => {
  switch (status) {
    case 'success':
      return {
        status: 'Success',
        color: 'green',
      };
    case 'failure':
      return {
        status: 'Failure',
        color: 'failed',
      };
    default:
      return {
        status: '',
        color: 'primary',
      };
  }
};

export const isEmptyObj = <T extends {[key in string]: any}>(obj: T): boolean => {
  return obj.constructor === Object && Object.keys(obj).length === 0 ? true : false;
};
