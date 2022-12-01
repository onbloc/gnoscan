export const parseFloatNum = (v: number | string, fixed: number): number => {
  return parseFloat(Number(v).toFixed(fixed));
};

export const numberWithFixedCommas = (v: number, fixed?: number): string => {
  const currnetFixed = fixed ?? 0;
  const fixedValue = v > 0 ? v.toFixed(currnetFixed) : v;
  const parts = fixedValue.toString().split('.');
  const decimal = parts[1] && Number(parts[1]) > 0 ? '.' + parts[1] : '';
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimal;
};

export const numberWithCommas = (v: number | string) => {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function formatAddress(v: string, num: number = 4): string {
  return v.length < 40 ? v : `${v.slice(0, num)}...${v.slice(-num)}`;
}

export function formatEllipsis(v: string, num: number = 11) {
  return v.length > num ? `${v.slice(0, num)}..` : v;
}
