/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { NftCollectionTitle } from "./nft-collection-title";

const GNFT = "gno.land/r/gnoswap/gnft";

jest.mock(
  "next/link",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      children,
);
jest.mock("@/common/hooks/use-network", () => ({ useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }) }));
jest.mock(
  "@/assets/svgs/icon-nft-collection-default.svg",
  () =>
    function DefaultIcon() {
      return <svg data-testid="default-icon" />;
    },
);
jest.mock("@/common/react-query/meta", () => ({
  useGetNftCollectionMetaQuery: () => ({
    data: [{ id: GNFT, pkg_path: GNFT, name: "GNOSWAP NFT", symbol: "GNFT", image: "/grc721/images/gnft.svg" }],
  }),
}));

const render = (packagePath: string, failImage = false) => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <NftCollectionTitle tokenId={packagePath} name="Collection" packagePath={packagePath} />
      </ThemeProvider>,
    ),
  );
  if (failImage) {
    act(() => {
      container.querySelector("img")!.dispatchEvent(new Event("error"));
    });
  }
  const html = container.innerHTML;
  act(() => root.unmount());
  return html;
};

describe("NftCollectionTitle", () => {
  it("shows the token resource logo for a listed collection", () => {
    const html = render(GNFT);
    expect(html).toMatch(/<img[^>]+src="https:\/\/[^"]+\/grc721\/images\/gnft\.svg"/);
    expect(html).not.toContain("default-icon");
  });

  it("falls back to the default icon for an unlisted collection", () => {
    const html = render("gno.land/r/demo/foonft");
    expect(html).not.toContain("<img");
    expect(html).toContain("default-icon");
  });

  it("falls back to the default icon when the logo fails to load", () => {
    const html = render(GNFT, true);
    expect(html).not.toContain("<img");
    expect(html).toContain("default-icon");
  });
});
