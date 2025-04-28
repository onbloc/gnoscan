import { parseSearchString } from "./search.utility";

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
