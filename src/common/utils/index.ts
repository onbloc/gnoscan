import {PaletteKeyType} from '@/styles/theme';

export type StatusKeyType = 'success' | 'failure';
export interface StatusResultType {
  status: string;
  color: PaletteKeyType;
}

export const numberWithFixedCommas = (v: number | string, fixed?: number): string => {
  const fix = fixed ?? 6;
  const floatNum = parseFloatNum(v);
  const integerCheck = Number.isInteger(Number(floatNum));
  if (integerCheck) {
    return numberWithCommas(floatNum);
  } else {
    const split = floatNum.split('.');
    const commasNum = numberWithCommas(split[0]);
    const fixedNum = decimalFixed(split[1], fix);
    return `${commasNum}.${fixedNum}`;
  }
};

export const decimalFixed = (v: number | string, fixed: number) => {
  return String(v).slice(0, fixed);
};

export const numberWithCommas = (v: number | string) => {
  if (v === '0' || !Boolean(v)) return '0';
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseFloatNum = (v: number | string): string => {
  if (v === '0' || !Boolean(v)) return '0';
  return parseFloat(v.toString()).toString();
};

export function formatAddress(v: string, num: number = 4): string {
  return v.length < 40 ? v : `${v.slice(0, num)}...${v.slice(-num)}`;
}

export function formatEllipsis(v: string, num: number = 11) {
  return v.length > num ? `${v.slice(0, num)}..` : v;
}

export const decimalPointWithCommas = (v: string | number, fixed?: number): string[] | string => {
  if (v === '0' || !Boolean(v)) return ['0'];
  const fix = fixed ?? 6;
  const integerCheck = Number.isInteger(v);
  if (integerCheck) {
    return [numberWithCommas(v)];
  } else {
    const result = numberWithFixedCommas(v, fix);
    return result.split('.');
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
