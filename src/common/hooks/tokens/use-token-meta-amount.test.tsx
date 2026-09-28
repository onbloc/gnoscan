import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { useTokenMetaAmount } from "./use-token-meta-amount";

jest.mock("@/common/utils/native-token-utility", () => ({ isUgnot: () => false, toGNOTAmount: jest.fn() }));
jest.mock("@/common/hooks/common/use-token-resource-meta", () => ({
  useTokenResourceMeta: jest.fn(),
}));
jest.mock("@/common/react-query/token/api/use-get-token-meta-by-path", () => ({
  useGetTokenMetaByPath: jest.fn(),
}));

const mockUseTokenResourceMeta = jest.mocked(useTokenResourceMeta);
const mockUseGetTokenMetaByPath = jest.mocked(useGetTokenMetaByPath);

const DENOM = "gno.land/r/g1abc/bubble";

beforeEach(() => {
  mockUseGetTokenMetaByPath.mockReset();
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

it("shows only the raw amount without retrying when a token has no metadata", () => {
  mockBackendMeta();

  expect(renderAmount()).toEqual({ value: "300000000000", denom: "" });
  expect(mockUseGetTokenMetaByPath).toHaveBeenCalledWith(DENOM, { retry: false });
});

it("applies backend decimals and symbol when metadata exists", () => {
  mockBackendMeta({ symbol: "BUBBLE", decimals: 6 });

  expect(renderAmount()).toEqual({ value: "300,000", denom: "BUBBLE" });
});

it("falls back to the raw amount when the backend response has no decimals", () => {
  mockBackendMeta({ symbol: "BUBBLE" });

  expect(renderAmount()).toEqual({ value: "300000000000", denom: "" });
});

it("uses the static resource list without calling the token meta API", () => {
  mockBackendMeta();
  mockUseTokenResourceMeta.mockReturnValue({
    hasTokenResourceMeta: () => true,
    getTokenMeta: () => ({ name: "Bubble", symbol: "BBL", decimals: 3 }),
  } as never);

  expect(renderAmount()).toEqual({ value: "300,000,000", denom: "BBL" });
  expect(mockUseGetTokenMetaByPath).toHaveBeenCalledWith("", { retry: false });
});
