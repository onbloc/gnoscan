import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTokenMeta } from "./use-token-meta";

const RESOURCE_ONLY = "gno.land/r/demo/resourceonly";

// Backend GRC20 list: only GNS.
jest.mock("@/common/react-query/realm", () => ({
  useGetGRC20Tokens: () => ({
    isFetched: true,
    data: [{ packagePath: "gno.land/r/gnoswap/gns", name: "Gnoswap", symbol: "GNS", decimals: 6 }],
  }),
}));

// Token resource list: a token the backend list doesn't have.
jest.mock("@/common/react-query/meta", () => ({
  useGetTokenMetaQuery: () => ({
    isFetched: true,
    data: [{ id: RESOURCE_ONLY, name: "Resource Only", symbol: "RSO", decimals: 4 }],
  }),
}));

const getAmount = (tokenId: string, raw: string) => {
  let amount: { value: string; denom: string } | undefined;
  const Probe = () => {
    amount = useTokenMeta().getTokenAmount(tokenId, raw);
    return null;
  };
  renderToStaticMarkup(<Probe />);
  return amount;
};

describe("useTokenMeta getTokenAmount", () => {
  it("uses the backend GRC20 list", () => {
    expect(getAmount("gno.land/r/gnoswap/gns", "1500000")).toEqual({ value: "1.5", denom: "GNS" });
  });

  it("uses the token resource list for tokens missing from the backend list", () => {
    expect(getAmount(RESOURCE_ONLY, "12345")).toEqual({ value: "1.2345", denom: "RSO" });
  });

  it("applies the wugnot decimals override when neither list has it", () => {
    expect(getAmount("gno.land/r/gnoland/wugnot", "5000000")).toEqual({ value: "5", denom: "wugnot" });
  });

  it("shows unknown tokens as raw values", () => {
    expect(getAmount("gno.land/r/demo/unknown", "12345")).toEqual({ value: "12345", denom: "unknown" });
  });

  it("keeps native GNOT", () => {
    expect(getAmount("ugnot", "1000000")).toEqual({ value: "1", denom: "GNOT" });
  });
});
