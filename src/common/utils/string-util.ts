/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from "bignumber.js";
import { isBech32Address } from "./bech32.utility";

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
  if (BigNumber(amount).isNaN()) return "0";
  return BigNumber(amount).toFormat();
}

export function makeCompactNumber(amount: string | number): string {
  if (BigNumber(amount).isNaN()) return "0";
  return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 3 }).format(Number(amount));
}

export function makeDisplayTokenAmount(amount: string | number, decimals = 6): string {
  return BigNumber(amount)
    .shiftedBy(decimals * -1)
    .toFormat();
}

export function makeDisplayNumberWithDefault(value: string | number | null | undefined, defaultValue = "-") {
  if (value === null || value === undefined || BigNumber(value).isNaN()) {
    return defaultValue;
  }

  return makeDisplayNumber(value);
}

export function toString(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
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

export function makeQueryString(params: { [key in string]: string } | null) {
  if (!params) {
    return "";
  }

  return Object.entries(params)
    .map(entry => `${entry[0]}=${entry[1]}`)
    .join("&");
}

export function formatDisplayPackagePath(packagePath: string | null | undefined): string {
  if (!packagePath) {
    return "";
  }

  const elements = packagePath.split("/");
  return elements.map(element => (isBech32Address(element) ? textEllipsis(element, 4) : element)).join("/");
}

export function makeQueryParameter(data: {
  [key in string]: string | number | bigint | boolean | null | undefined;
}) {
  const params = Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      return `${key}=${value?.toString()}`;
    });

  if (params.length === 0) {
    return "";
  }

  return "?" + params.join("&");
}

/** Like makeQueryParameter, but URL-encodes keys and values (use for free-form user input). */
export function makeEncodedQueryParameter(data: {
  [key in string]: string | number | bigint | boolean | null | undefined;
}) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) params.append(key, value.toString());
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function isValidBlockHeight(value: string | string[] | undefined): boolean {
  const num = Number(value);
  return !Number.isNaN(num) && Number.isFinite(num) && num >= 0;
}

/**
 * Keeps the end of text and cuts the front with "…" so the result fits in maxWidth.
 * measure returns the rendered width of a string. Returns text unchanged when it already fits.
 */
export function truncateStartToWidth(text: string, maxWidth: number, measure: (value: string) => number): string {
  if (measure(text) <= maxWidth) return text;

  // Binary search the shortest cut that fits; widths grow monotonically with the kept tail.
  let low = 1;
  let high = text.length;
  while (low < high) {
    const cut = Math.floor((low + high) / 2);
    if (measure(`…${text.slice(cut)}`) <= maxWidth) high = cut;
    else low = cut + 1;
  }
  return `…${text.slice(low)}`;
}
