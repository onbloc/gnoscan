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

/**
 * Display form of a package path wherever one is shown: every bech32 address segment keeps only its first
 * and last `visibleLength` characters; the other segments (nested package and token names) stay intact.
 * "r/g1t2kg2vtr3fukg43eujkn6x53gfdyakhngt4sfd/gnofly/nfts/planes" -> "r/g1t2...4sfd/gnofly/nfts/planes"
 * Fit it into a narrow area with the truncate-from-start path text so the trailing names stay visible.
 */
export function formatDisplayPackagePath(packagePath: string | null | undefined, visibleLength = 4): string {
  if (!packagePath) {
    return "";
  }

  return packagePath
    .split("/")
    .map(segment =>
      segment.length > visibleLength * 2 && isBech32Address(segment)
        ? `${segment.slice(0, visibleLength)}...${segment.slice(-visibleLength)}`
        : segment,
    )
    .join("/");
}

/**
 * Fits a display path into `availableWidth` by dropping whole leading segments behind a "..." marker, so the
 * trailing names are never cut and no address is cut in the middle: "r/g1n4...rhmt/bazaar/c/name" becomes
 * ".../bazaar/c/name", then ".../c/name". The last two segments are always kept so a short final name such as
 * "v0" still shows its package; when even those do not fit, the front of them is cut behind a single "..."
 * ("...rc20faucet/v0"). `measure` returns the rendered width of a candidate.
 */
export function fitPathToWidth(path: string, availableWidth: number, measure: (candidate: string) => number): string {
  if (measure(path) <= availableWidth) {
    return path;
  }

  const segments = path.split("/");
  const minKept = Math.min(2, Math.max(segments.length - 1, 1));
  for (let dropped = 1; dropped <= segments.length - minKept; dropped++) {
    const candidate = `.../${segments.slice(dropped).join("/")}`;
    if (measure(candidate) <= availableWidth) {
      return candidate;
    }
  }

  // Binary search the shortest cut that fits; widths grow monotonically with the kept tail. A cut that lands
  // inside an address's own "..." must not leave two markers in a row, so leading dots are dropped first.
  const tail = segments.slice(-minKept).join("/");
  const cutFront = (cut: number) => `...${tail.slice(cut).replace(/^\.+/, "")}`;
  let low = 1;
  let high = tail.length;
  while (low < high) {
    const cut = Math.floor((low + high) / 2);
    if (measure(cutFront(cut)) <= availableWidth) high = cut;
    else low = cut + 1;
  }
  return cutFront(low);
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
