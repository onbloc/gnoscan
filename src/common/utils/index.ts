import {PaletteKeyType} from '@/styles/theme';
import BigNumber from 'bignumber.js';

export type StatusKeyType = 'success' | 'failure';
export interface StatusResultType {
  status: string;
  color: PaletteKeyType;
}

export const numberWithCommas = (v: string | number | BigNumber) => {
  const bigNum = BigNumber(v);
  const toFormatVal = bigNum.toFormat();
  return toFormatVal;
};

export const numberWithFixedCommas = (v: BigNumber, fixed?: number): string => {
  const fix = fixed ?? 6;
  const toFormatVal = v.toFormat(fix).replace(/\.?0+$/, '');
  return toFormatVal;
};

export function formatAddress(v: string, num = 4): string {
  return v.length < 40 ? v : `${v.slice(0, num)}...${v.slice(-num)}`;
}

export function formatEllipsis(v: string, num = 11, ellipsis = 2) {
  const formatEllipsis = '.'.repeat(ellipsis);
  return v.length > num ? `${v.slice(0, num)}${formatEllipsis}` : v;
}

export const decimalPointWithCommas = (v: BigNumber, fixed?: number): string[] | string => {
  if (!Boolean(v) || BigNumber(v).isNaN()) return ['0'];
  const fix = fixed ?? 6;
  const commasNum = numberWithFixedCommas(v, fix);
  return commasNum.split('.');
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
