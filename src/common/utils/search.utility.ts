import BigNumber from "bignumber.js";

import { isBech32Address } from "./bech32.utility";
import { isHash } from "./transaction.utility";
import { makeQueryString } from "./string-util";

/**
 * Parses a URL search string into an object of key-value pairs.
 *
 * @param search - The URL search string to parse (e.g., "?keyword=value&param=value")
 * @returns An object containing the parsed key-value pairs from the search string
 */
export function parseSearchString(search: string) {
  if (!search || search.length === 1) {
    return {};
  }

  return search
    .replace("?", "")
    .split("&")
    .reduce<{ [key in string]: string }>((accum, value) => {
      const keySeparatorIndex = value.lastIndexOf(".json");
      const current =
        keySeparatorIndex > -1 ? value.substring(keySeparatorIndex + ".json".length, value.length) : value;
      const separatorIndex = current.indexOf("=");
      if (separatorIndex < 0 || separatorIndex + 1 >= current.length) {
        return accum;
      }

      const values = [
        current.substring(0, separatorIndex),
        decodeURIComponent(current.substring(separatorIndex + 1, current.length)).replaceAll(" ", "+"),
      ];
      if (values.length === 0) {
        return accum;
      }

      accum[values[0]] = values.length > 0 ? values[1] : "";
      return accum;
    }, {});
}

/**
 * Processes a search keyword and determines the appropriate redirect destination.
 * Used in getServerSideProps to handle search functionality and redirects.
 *
 * @param keyword - The search keyword to process
 * @param params - Object containing all URL parameters
 * @returns A redirect object with destination URL if a redirect is needed, null otherwise
 *
 * Redirect logic:
 * - Numbers -> Block page
 * - "gno.land" prefixed strings -> Realm details page
 * - Bech32 addresses -> Account page
 * - Transaction hashes -> Transaction details page
 * - Other strings (length > 2, no spaces) -> Account page
 * - All other cases -> No redirect (returns null)
 *
 * Network parameters (type, rpcUrl, indexerUrl, chainId) are preserved in all redirects.
 */
export function processSearchKeyword(keyword: string, params: Record<string, string>) {
  // Extract network parameters to preserve them in redirects
  const networkParams = Object.entries(params).reduce<{ [key in string]: string }>((acc, current) => {
    if (["type", "rpcUrl", "indexerUrl", "chainId"].includes(current[0])) {
      acc[current[0]] = current[1];
    }
    return acc;
  }, {});

  // Case 1: Numeric input (block number)
  const isNumber = !BigNumber(keyword).isNaN();
  if (isNumber) {
    const queryString = makeQueryString(networkParams);
    return {
      keyword,
      permanent: false,
      destination: `/block/${keyword}?${queryString}`,
    };
  }

  // Case 2: Realm path (starts with "gno.land")
  if (keyword.startsWith("gno.land")) {
    const queryString = makeQueryString({
      ...networkParams,
      path: encodeURIComponent(keyword),
    });
    return {
      keyword,
      permanent: false,
      destination: `/realms/details?${queryString}`,
    };
  }

  // Case 3: Bech32 address (account)
  if (isBech32Address(keyword)) {
    const queryString = makeQueryString(networkParams);
    return {
      keyword,
      permanent: false,
      destination: `/account/${keyword}?${queryString}`,
    };
  }

  // Case 4: Transaction hash
  if (isHash(keyword)) {
    const queryString = makeQueryString({
      ...networkParams,
      txhash: encodeURIComponent(keyword),
    });
    return {
      keyword,
      permanent: false,
      destination: `/transactions/details?${queryString}`,
    };
  }

  // Case 5: Common search term (no spaces, length > 2)
  if (keyword.length > 2 && !keyword.includes(" ")) {
    const queryString = makeQueryString(networkParams);
    return {
      keyword,
      permanent: false,
      destination: `/account/${keyword}?${queryString}`,
    };
  }

  // No redirect needed
  return null;
}
