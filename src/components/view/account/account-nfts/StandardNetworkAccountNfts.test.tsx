import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import StandardNetworkAccountNfts from "./StandardNetworkAccountNfts";

let mockCollections: { tokenId: string; name: string; symbol: string; tokenCount: number }[] = [];

jest.mock("../account-address/AccountAddress.styles", () => ({
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));
jest.mock("./AccountNftCard", () => () => null);
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: (_key: string, initial: string) => [initial, jest.fn()],
}));
jest.mock("@/common/hooks/nft/use-nft-artwork", () => ({ useNftArtwork: () => () => ({}) }));
jest.mock("@/common/react-query/account/api/use-get-account-grc721-collections", () => ({
  useGetAccountGRC721Collections: () => ({ data: { items: mockCollections }, isFetched: true }),
}));
jest.mock("@/common/react-query/account/api/use-get-account-nfts", () => ({
  useGetAccountNfts: () => ({ data: undefined, isFetched: false }),
}));
jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({ totalPages }: { totalPages: number }) => <nav aria-label="Pagination">{totalPages}</nav>,
}));

const render = () =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <StandardNetworkAccountNfts address="g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5" />
    </ThemeProvider>,
  );

// Text nodes of the rendered markup, so assertions do not depend on the element structure.
const texts = (html: string) => html.split(/<[^>]*>/).filter(Boolean);
const hasLabel = (html: string, label: string) => html.includes(`aria-label="${label}"`);

it("shows an empty NFTs card for accounts without NFTs", () => {
  mockCollections = [];
  const html = render();

  expect(texts(html)).toEqual(expect.arrayContaining(["NFTs", "0"]));
  expect(texts(html)).not.toContain("No data to display");
  expect(hasLabel(html, "Loading NFTs")).toBe(false);
  expect(hasLabel(html, "NFT collections")).toBe(false);
  expect(hasLabel(html, "Pagination")).toBe(false);
});

it("keeps the chips, skeleton, and pagination for accounts that hold NFTs", () => {
  mockCollections = [{ tokenId: "gno.land/r/demo/nft", name: "Demo", symbol: "DEMO", tokenCount: 20 }];
  const html = render();

  expect(texts(html)).toEqual(expect.arrayContaining(["NFTs", "20", "Demo"]));
  expect(hasLabel(html, "NFT collections")).toBe(true);
  expect(hasLabel(html, "Loading NFTs")).toBe(true);
  expect(hasLabel(html, "Pagination")).toBe(true);
});
