/**
 * 소수점이 0이라면 0 제거.
 * 소수점이 없는 정수일 경우, 정수에 comma 찍고 return.
 * 소수점이 있는 경우, 소수점 기준으로 comma 찍고 소수점 slice 후 return.
 */
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

/**
 * 소수점이 반올림 없이 자르기
 */
export const decimalFixed = (v: number | string, fixed: number) => {
  return String(v).slice(0, fixed);
};

/**
 * 정수일 경우에만 가능하며 comma 찍고 return.
 */
export const numberWithCommas = (v: number | string) => {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 소수점이 0일 경우 없애기
 */
export const parseFloatNum = (v: number | string): string => {
  return parseFloat(v.toString()).toString();
};

export function formatAddress(v: string, num: number = 4): string {
  return v.length < 40 ? v : `${v.slice(0, num)}...${v.slice(-num)}`;
}

export function formatEllipsis(v: string, num: number = 11) {
  return v.length > num ? `${v.slice(0, num)}..` : v;
}

/**
 * account-text에서 사용.
 */
export const decimalPointWithCommas = (v: string | number, fixed?: number): string[] | string => {
  if (v === '0' || !Boolean(v)) return ['0'];
  const fix = fixed ?? 6;
  const integerCheck = Number.isInteger(v);
  if (integerCheck) {
    return [v.toString()];
  } else {
    const result = numberWithFixedCommas(v, fix);
    return result.split('.');
  }
};
