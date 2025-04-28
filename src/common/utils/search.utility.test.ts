/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseSearchString, processSearchKeyword, NETWORK_PARAM_KEYS } from "./search.utility";

describe("parseSearchString", () => {
  // Basic test cases
  describe("Basic Test cases", () => {
    test("Basic 1. should parse standard query parameters", () => {
      const result = parseSearchString("?keyword=lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=");
      expect(result).toEqual({ keyword: "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=" });
    });

    test("Basic 2. should parse standard query parameters", () => {
      const result = parseSearchString("?chainId=portal-loop&txHash=lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=");
      expect(result).toEqual({
        chainId: "portal-loop",
        txHash: "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=",
      });
    });

    test("Basic 3. should parse standard query parameters", () => {
      const result = parseSearchString("?chainId=portal-loop&path=gno.land/r/gnoland/valopers_proposal/v2");
      expect(result).toEqual({
        chainId: "portal-loop",
        path: "gno.land/r/gnoland/valopers_proposal/v2",
      });
    });

    test("Basic 5. should handle values with spaces", () => {
      const result = parseSearchString("?chainId=portal - loop&path=gno.land/r/gnoland/valopers_proposal/v2");
      expect(result).toEqual({
        chainId: "portal - loop",
        path: "gno.land/r/gnoland/valopers_proposal/v2",
      });
    });

    test("Basic 6. should handle values with special characters", () => {
      const result = parseSearchString("?search=react+hooks&special=!@#$%^");
      expect(result).toEqual({ search: "react hooks", special: "!@#$%^" });
    });

    test("Basic 7. should handle values with special characters", () => {
      const result = parseSearchString("?search=react hooks&special=!@#$%^");
      expect(result).toEqual({ search: "react hooks", special: "!@#$%^" });
    });
  });

  // Prefix handling test case
  describe("Prefix handling test cases", () => {
    test("Prefix 1. should handle query string without question mark prefix", () => {
      const result = parseSearchString("chainId=portal-loop&txHash=lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=");
      expect(result).toEqual({
        chainId: "portal-loop",
        txHash: "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=",
      });
    });

    test("Prefix 2. should handle query string with .json extension", () => {
      const result = parseSearchString(
        "/api/data.json?chainId=portal-loop&path=gno.land/r/gnoland/valopers_proposal/v2",
      );
      expect(result).toEqual({
        chainId: "portal-loop",
        path: "gno.land/r/gnoland/valopers_proposal/v2",
      });
    });

    test("Prefix 3. should return empty object for .json extension without query params", () => {
      const result = parseSearchString("/api/data.json");
      expect(result).toEqual({});
    });

    test("Prefix 4. should handle multiple .json occurrences in path", () => {
      const result = parseSearchString("/api/data.json/user.json?keyword=lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=");
      expect(result).toEqual({
        keyword: "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=",
      });
    });
  });

  // Edge test cases
  describe("Edge test cases", () => {
    test("Edge 1. should return empty object for empty string", () => {
      const result = parseSearchString("");
      expect(result).toEqual({});
    });

    test("Edge 2. should return empty object for just a question mark", () => {
      const result = parseSearchString("?");
      expect(result).toEqual({});
    });

    test("Edge 3. should handle parameters with no values", () => {
      const result = parseSearchString("?param1=&param2=value");
      expect(result).toEqual({ param1: "", param2: "value" });
    });

    test("Edge 4. should handle parameters with no equals sign", () => {
      const result = parseSearchString("?param1&param2=value");
      expect(result).toEqual({ param1: "", param2: "value" });
    });

    test("Edge 5. should handle query string with hash fragment", () => {
      const result = parseSearchString("?chainId=portal-loop&txHash=abc123#section1");
      expect(result).toEqual({ chainId: "portal-loop", txHash: "abc123#section1" });
    });

    test("Edge 6. should handle duplicate parameter names (last one wins)", () => {
      const result = parseSearchString("?param=value1&param=value2");
      expect(result).toEqual({ param: "value2" });
    });
  });

  // Special format test cases
  describe("Special format test cases", () => {
    test("Special 1. should handle URL encoded values", () => {
      const result = parseSearchString("?query=search%20term&path=gno.land%2Fr%2Fgnoland");
      expect(result).toEqual({ query: "search term", path: "gno.land/r/gnoland" });
    });

    test("Special 2. should handle array-like parameters with brackets", () => {
      const result = parseSearchString("?filters[]=value1&filters[]=value2");
      expect(result).toEqual({ "filters[]": "value2" });
    });

    test("Special 3. should handle parameters with plus signs as spaces", () => {
      const result = parseSearchString("?query=hello+world&category=web+development");
      expect(result).toEqual({ query: "hello world", category: "web development" });
    });

    test("Special 4. should handle parameters with encoded special characters", () => {
      const result = parseSearchString("?query=%21%40%23%24%25%5E&path=%26%2A%28%29");
      expect(result).toEqual({ query: "!@#$%^", path: "&*()" });
    });
  });
});

describe("processSearchKeyword", () => {
  const networkParams = {
    type: "mainnet",
    rpcUrl: "https://rpc.gno.network",
    indexerUrl: "https://index.gno.network",
    chainId: "gno-mainnet-1",
  };

  // Edge cases and input validation
  describe("Input validation and edge cases", () => {
    test("Empty keywords should return null", () => {
      expect(processSearchKeyword("", networkParams)).toBeNull();
      expect(processSearchKeyword("   ", networkParams)).toBeNull();
      expect(processSearchKeyword(null as any, networkParams)).toBeNull();
      expect(processSearchKeyword(undefined as any, networkParams)).toBeNull();
    });

    test("Spaces before and after keywords should be removed", () => {
      const blockNumber = "  54321  ";
      const result = processSearchKeyword(blockNumber, networkParams);

      expect(result).toEqual({
        keyword: "54321",
        permanent: false,
        destination:
          "/block/54321?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1",
      });
    });

    test("Should work even if the network parameter is empty", () => {
      const blockNumber = "12345";
      const result = processSearchKeyword(blockNumber, {});

      expect(result).toEqual({
        keyword: blockNumber,
        permanent: false,
        destination: `/block/${blockNumber}?`,
      });
    });

    test("Only parameters defined in NETWORK_PARAM_KEYS should be included in the URL", () => {
      const blockNumber = "12345";
      const paramsWithExtra = {
        ...networkParams,
        extraParam1: "extra1",
        extraParam2: "extra2",
      };

      const result = processSearchKeyword(blockNumber, paramsWithExtra);
      const queryParams = new URLSearchParams(result?.destination.split("?")[1] || "");

      NETWORK_PARAM_KEYS.forEach(key => {
        expect(queryParams.has(key)).toBe(true);
        expect(queryParams.get(key)).toBe(networkParams[key]);
      });

      expect(queryParams.has("extraParam")).toBe(false);
      expect(queryParams.has("extraParam1")).toBe(false);
      expect(queryParams.has("extraParam2")).toBe(false);
    });
  });

  // Block number search tests
  describe("processBlockNumber", () => {
    test("Block number search should redirect to the block page", () => {
      const blockNumber = "12345";
      const result = processSearchKeyword(blockNumber, networkParams);

      expect(result).toEqual({
        keyword: blockNumber,
        permanent: false,
        destination: `/block/${blockNumber}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });

    test("Must also be able to handle large numbers (BigNumber)", () => {
      const blockNumber = "123456789012345678901234567890";
      const result = processSearchKeyword(blockNumber, networkParams);

      expect(result).toEqual({
        keyword: blockNumber,
        permanent: false,
        destination: `/block/${blockNumber}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });
  });

  // Realm path search tests
  describe("processRealmPath", () => {
    test("Realm path search should redirect to realm detail page", () => {
      const realmPath = "gno.land/r/demo/users";
      const result = processSearchKeyword(realmPath, networkParams);

      expect(result).toEqual({
        keyword: realmPath,
        permanent: false,
        destination: `/realms/details?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1&path=${encodeURIComponent(
          realmPath,
        )}`,
      });
    });

    test("Realm path with subdirectories should redirect correctly", () => {
      const realmPath = "gno.land/r/gnoland/valopers_proposal/v2";
      const result = processSearchKeyword(realmPath, networkParams);

      expect(result).toEqual({
        keyword: realmPath,
        permanent: false,
        destination: `/realms/details?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1&path=${encodeURIComponent(
          realmPath,
        )}`,
      });
    });
  });

  // Bech32 address search tests
  describe("processBech32Address", () => {
    test("Bech32 address search should redirect to account page", () => {
      const address = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";
      const result = processSearchKeyword(address, networkParams);

      expect(result).toEqual({
        keyword: address,
        permanent: false,
        destination: `/account/${address}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });

    test("Different prefix Bech32 address should also work", () => {
      const address = "adv1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";
      const result = processSearchKeyword(address, networkParams);

      expect(result).toEqual({
        keyword: address,
        permanent: false,
        destination: `/account/${address}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });
  });

  // Transaction hash search tests
  describe("processTransactionHash", () => {
    test("Transaction hash search should redirect to the transaction details page", () => {
      const txHash = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=";
      const result = processSearchKeyword(txHash, networkParams);

      expect(result).toEqual({
        keyword: txHash,
        permanent: false,
        destination: `/transactions/details?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1&txhash=${encodeURIComponent(
          txHash,
        )}`,
      });
    });

    test("Transaction hash with different format should also work", () => {
      const txHash = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=";
      const result = processSearchKeyword(txHash, networkParams);

      expect(result).toEqual({
        keyword: txHash,
        permanent: false,
        destination: `/transactions/details?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1&txhash=${encodeURIComponent(
          txHash,
        )}`,
      });
    });
  });

  // Account search tests
  describe("processAccountSearch", () => {
    test("General account search should redirect to the account page", () => {
      const accountName = "testuser";
      const result = processSearchKeyword(accountName, networkParams);

      expect(result).toEqual({
        keyword: accountName,
        permanent: false,
        destination: `/account/${accountName}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });

    test("Valid account patterns", () => {
      const validAccounts = ["user123", "test-user", "test_user", "test.user", "TEST", "abc123"];

      for (const account of validAccounts) {
        const result = processSearchKeyword(account, networkParams);
        expect(result).not.toBeNull();
        expect(result?.destination).toContain(`/account/${account}?`);
      }
    });

    test("Account names 2 characters or less should return null", () => {
      expect(processSearchKeyword("ab", networkParams)).toBeNull();
      expect(processSearchKeyword("a", networkParams)).toBeNull();
    });

    test("Account names containing spaces should return null", () => {
      expect(processSearchKeyword("test user", networkParams)).toBeNull();
    });

    test("Invalid account patterns should return null", () => {
      expect(processSearchKeyword("test&user", networkParams)).toBeNull();
      expect(processSearchKeyword("test@user", networkParams)).toBeNull();
      expect(processSearchKeyword("$test", networkParams)).toBeNull();
    });

    test("Non-matching patterns should fall back to account search if valid", () => {
      const invalidBlockNumber = "123abc";
      const result = processSearchKeyword(invalidBlockNumber, networkParams);

      expect(result).toEqual({
        keyword: invalidBlockNumber,
        permanent: false,
        destination: `/account/${invalidBlockNumber}?type=mainnet&rpcUrl=https://rpc.gno.network&indexerUrl=https://index.gno.network&chainId=gno-mainnet-1`,
      });
    });
  });
});
