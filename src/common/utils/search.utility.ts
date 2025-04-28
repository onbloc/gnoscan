import BigNumber from "bignumber.js";

import { isBech32Address } from "./bech32.utility";
import { isHash } from "./transaction.utility";
import { makeQueryString } from "./string-util";

export type NetworkParams = Record<string, string>;
export type SearchRedirect = {
  keyword: string;
  permanent: boolean;
  destination: string;
} | null;

export const NETWORK_PARAM_KEYS = ["type", "rpcUrl", "indexerUrl", "chainId"] as const;

/**
 * Parses a URL search string into an object of key-value pairs.
 *
 * @param search - The URL search string to parse (e.g., "?keyword=value&param=value")
 * @returns An object containing the parsed key-value pairs from the search string
 */
export function parseSearchString(search: string) {
  if (!search || search.length <= 1) {
    return {};
  }

  const jsonIndex = search.lastIndexOf(".json");
  if (jsonIndex > -1) {
    search = search.substring(jsonIndex + ".json".length);
  }

  const searchParams = new URLSearchParams(search.startsWith("?") ? search.substring(1) : search);
  const result: { [key: string]: string } = {};

  for (const [key, value] of searchParams.entries()) {
    // The URLSearchParams API already handles URL encoding, so no separate whitespace conversion is required.
    // result[key] = value.replaceAll(" ", "+")
    result[key] = value;
  }

  return result;
}

/**
 * Extract network-related parameters.
 *
 * @param params
 * @returns Objects containing only network-related parameters
 */
function extractNetworkParams(params: NetworkParams): NetworkParams {
  return Object.entries(params).reduce<NetworkParams>((acc, [key, value]) => {
    if (NETWORK_PARAM_KEYS.includes(key as (typeof NETWORK_PARAM_KEYS)[number])) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * Processes block number input and returns redirect information.
 *
 * @param keyword - Search keyword
 * @param networkParams - network-related parameters
 */
function processBlockNumber(keyword: string, networkParams: NetworkParams): SearchRedirect {
  const isNumber = !BigNumber(keyword).isNaN();
  if (isNumber) {
    const queryString = makeQueryString(networkParams);
    return {
      keyword,
      permanent: false,
      destination: `/block/${keyword}?${queryString}`,
    };
  }
  return null;
}

/**
 * Processes the Realm path input and returns redirection information.
  
 * @param keyword - Search keyword
 * @param networkParams - network-related parameters
 */
function processRealmPath(keyword: string, networkParams: NetworkParams): SearchRedirect {
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
  return null;
}

/**
 * Process the Bech32 address input and return redirection information.
 *
 * @param keyword - Search keyword
 * @param networkParams - network-related parameters
 */
function processBech32Address(keyword: string, networkParams: NetworkParams): SearchRedirect {
  if (isBech32Address(keyword)) {
    const queryString = makeQueryString(networkParams);
    return {
      keyword,
      permanent: false,
      destination: `/account/${keyword}?${queryString}`,
    };
  }
  return null;
}

/**
 * Processes the transaction hash input to return redirect information.
 *
 * @param keyword - Search keyword
 * @param networkParams - network-related parameters
 */
function processTransactionHash(keyword: string, networkParams: NetworkParams): SearchRedirect {
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
  return null;
}

/**
 * Processes account search input to return redirect information.
 *
 * @param keyword - Search keyword
 * @param networkParams - network-related parameters
 */
function processAccountSearch(keyword: string, networkParams: NetworkParams): SearchRedirect {
  if (keyword.length > 2 && !keyword.includes(" ")) {
    const validAccountPattern = /^[a-zA-Z0-9_\-\.]+$/;

    if (validAccountPattern.test(keyword)) {
      const queryString = makeQueryString(networkParams);
      return {
        keyword,
        permanent: false,
        destination: `/account/${keyword}?${queryString}`,
      };
    }
  }
  return null;
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
export function processSearchKeyword(keyword: string, params: Record<string, string>): SearchRedirect {
  if (!keyword || keyword.trim() === "") {
    return null;
  }

  const trimmedKeyword = keyword.trim();
  const networkParams = extractNetworkParams(params);

  const processors: Array<(keyword: string, networkParams: NetworkParams) => SearchRedirect> = [
    processBlockNumber,
    processRealmPath,
    processBech32Address,
    processTransactionHash,
    processAccountSearch,
  ];

  for (const processor of processors) {
    const result = processor(trimmedKeyword, networkParams);
    if (result) return result;
  }

  return null;
}
