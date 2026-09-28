import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTokenResourceMeta } from "./use-token-resource-meta";

const FACTORY = "gno.land/r/demo/defi/grc20factory";

jest.mock("@/common/react-query/meta", () => ({
  useGetTokenMetaQuery: () => ({
    isFetched: true,
    data: [
      { id: "ugnot", denom: "ugnot", name: "Gno.land", symbol: "GNOT", decimals: 6, image: "/gnot.svg" },
      {
        id: FACTORY,
        pkg_path: FACTORY,
        token_path: `${FACTORY}.PERUN`,
        name: "Perun",
        symbol: "PERUN",
        decimals: 6,
        image: "/perun.svg",
      },
    ],
  }),
}));

const getImage = (tokenKey: string) => {
  let image: string | undefined;
  const Probe = () => {
    image = useTokenResourceMeta().getTokenImage(tokenKey);
    return null;
  };
  renderToStaticMarkup(<Probe />);
  return image;
};

describe("useTokenResourceMeta getTokenImage", () => {
  it("resolves the image of the token named by the key", () => {
    expect(getImage(`${FACTORY}.PERUN`)).toMatch(/\/perun\.svg$/);
    expect(getImage(`${FACTORY}.PERUN.0000001`)).toMatch(/\/perun\.svg$/);
  });

  it("does not return another factory token's image", () => {
    expect(getImage(`${FACTORY}.MOULTEST`)).toBeUndefined();
  });

  it("still resolves native denoms by exact key", () => {
    expect(getImage("ugnot")).toMatch(/\/gnot\.svg$/);
  });
});
