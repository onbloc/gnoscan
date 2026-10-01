import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { AxiosError, AxiosResponse } from "axios";
import { retryTokenMetaRequest, useTokenMetaAmount } from "./use-token-meta-amount";

jest.mock("@/common/utils/native-token-utility", () => ({
  isUgnot: () => false,
  toGNOTAmount: jest.fn((value: string, denom: string) => ({ value, denom: denom.toUpperCase() })),
}));
jest.mock("@/common/hooks/common/use-token-resource-meta", () => ({
  useTokenResourceMeta: jest.fn(),
}));
jest.mock("@/common/react-query/token/api/use-get-token-meta-by-path", () => ({
  useGetTokenMetaByPath: jest.fn(),
}));

const mockUseTokenResourceMeta = jest.mocked(useTokenResourceMeta);
const mockUseGetTokenMetaByPath = jest.mocked(useGetTokenMetaByPath);
const mockToGNOTAmount = jest.mocked(toGNOTAmount);

const DENOM = "gno.land/r/g1abc/bubble";

beforeEach(() => {
  mockUseGetTokenMetaByPath.mockReset();
  mockToGNOTAmount.mockClear();
  // No static resource entry: getTokenMeta echoes the backend fallback it is given.
  mockUseTokenResourceMeta.mockReturnValue({
    hasTokenResourceMeta: () => false,
    getTokenMeta: (_: string, fallback: unknown) => fallback,
  } as never);
});

const mockBackendMeta = (data?: { symbol?: string; decimals?: number }) =>
  mockUseGetTokenMetaByPath.mockReturnValue({
    data: data ? { data } : undefined,
    isLoading: false,
    isFetched: true,
  } as never);

const renderAmount = (value = "300000000000") => {
  let result: ReturnType<typeof useTokenMetaAmount> | undefined;
  const Probe = () => {
    result = useTokenMetaAmount({ value, denom: DENOM });
    return null;
  };
  renderToStaticMarkup(<Probe />);
  return result?.amount;
};

it("falls back to the raw amount and package path when a token has no metadata", () => {
  mockBackendMeta();

  expect(renderAmount()).toEqual({ value: "300000000000", denom: DENOM.toUpperCase() });
  expect(mockToGNOTAmount).toHaveBeenCalledWith("300000000000", DENOM);
  expect(mockUseGetTokenMetaByPath).toHaveBeenCalledWith(DENOM, { retry: retryTokenMetaRequest });
});

it("applies backend decimals and symbol when metadata exists", () => {
  mockBackendMeta({ symbol: "BUBBLE", decimals: 6 });

  expect(renderAmount()).toEqual({ value: "300,000", denom: "BUBBLE" });
});

it("falls back to the raw amount and package path when the backend response has no decimals", () => {
  mockBackendMeta({ symbol: "BUBBLE" });

  expect(renderAmount()).toEqual({ value: "300000000000", denom: DENOM.toUpperCase() });
  expect(mockToGNOTAmount).toHaveBeenCalledWith("300000000000", DENOM);
});

it("uses the static resource list without calling the token meta API", () => {
  mockBackendMeta();
  mockUseTokenResourceMeta.mockReturnValue({
    hasTokenResourceMeta: () => true,
    getTokenMeta: () => ({ name: "Bubble", symbol: "BBL", decimals: 3 }),
  } as never);

  expect(renderAmount()).toEqual({ value: "300,000,000", denom: "BBL" });
  expect(mockUseGetTokenMetaByPath).toHaveBeenCalledWith("", { retry: retryTokenMetaRequest });
});

const httpError = (status: number) =>
  new AxiosError("Request failed", undefined, undefined, undefined, { status } as AxiosResponse);

it("does not retry when the token has no metadata", () => {
  expect(retryTokenMetaRequest(0, httpError(404))).toBe(false);
});

it("keeps retrying transient failures up to the default limit", () => {
  expect(retryTokenMetaRequest(0, httpError(500))).toBe(true);
  expect(retryTokenMetaRequest(2, new AxiosError("Network Error"))).toBe(true);
  expect(retryTokenMetaRequest(3, httpError(500))).toBe(false);
});

it("applies shared overrides such as the GNFT symbol on the raw fallback", () => {
  mockBackendMeta(undefined);
  mockUseTokenResourceMeta.mockReturnValue({
    hasTokenResourceMeta: () => false,
    getTokenMeta: (key: string, fallback: { symbol: string }) =>
      key.includes("gnoswap/gnft") ? { ...fallback, symbol: "GNFT" } : fallback,
  } as never);

  let result: ReturnType<typeof useTokenMetaAmount> | undefined;
  const Probe = () => {
    result = useTokenMetaAmount({ value: "1", denom: "gno.land/r/gnoswap/gnft.GNFT.0000000" });
    return null;
  };
  renderToStaticMarkup(<Probe />);
  expect(result?.amount).toEqual({ value: "1", denom: "GNFT" });
});
