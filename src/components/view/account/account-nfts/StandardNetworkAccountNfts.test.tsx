import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import StandardNetworkAccountNfts from "./StandardNetworkAccountNfts";

let mockCollections: {
  tokenId: string;
  name: string;
  symbol: string;
  tokenCount: number;
  ownedCount: number;
}[] = [];
const mockStateKeys: string[] = [];
let mockSavedPage: number | undefined;
const mockRequestedPages: number[] = [];

jest.mock("../account-address/AccountAddress.styles", () => ({
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));
jest.mock("./AccountNftCard", () => () => null);
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: (key: string, initial: unknown) => {
    mockStateKeys.push(key);
    return [key.endsWith(":nft-page") ? mockSavedPage ?? initial : initial, jest.fn()];
  },
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "chain-a" } }),
}));
jest.mock("@/common/hooks/nft/use-nft-artwork", () => ({ useNftArtwork: () => () => ({}) }));
jest.mock("@/common/hooks/nft/use-nft-collection-name", () => ({
  useNftCollectionName: () => (_path: string, name: string) => name,
}));
jest.mock("@/common/react-query/account/api/use-get-account-grc721-collections", () => ({
  useGetAccountGRC721Collections: () => ({ data: { items: mockCollections }, isFetched: true }),
}));
jest.mock("@/common/react-query/account/api/use-get-account-nfts", () => ({
  useGetAccountNfts: ({ page }: { page: number }) => {
    mockRequestedPages.push(page);
    return { data: undefined, isFetched: false };
  },
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

// The title and the chips match the NFT summary's collector count: only the owned NFTs. The grid still pages through the
// staked ones the account operates.
it("counts only the owned NFTs in the title and the chips", () => {
  mockCollections = [
    {
      tokenId: "gno.land/r/gnoswap/gnft.GNFT.0000000",
      name: "GnoSwap NFT",
      symbol: "GNFT",
      tokenCount: 208,
      ownedCount: 194,
    },
    { tokenId: "gno.land/r/demo/nft", name: "Demo", symbol: "DEMO", tokenCount: 27, ownedCount: 27 },
  ];
  const html = render();
  const text = texts(html);
  expect(text).toEqual(expect.arrayContaining(["NFTs", "ALL", "221", "GnoSwap NFT", "194", "Demo", "27"]));
  expect(text).not.toContain("235");
  expect(text).not.toContain("208");
  // 235 listed NFTs, 8 per page.
  expect(html).toMatch(/aria-label="Pagination">30</);
});

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
  mockCollections = [{ tokenId: "gno.land/r/demo/nft", name: "Demo", symbol: "DEMO", tokenCount: 20, ownedCount: 20 }];
  const html = render();

  expect(texts(html)).toEqual(expect.arrayContaining(["NFTs", "20", "Demo"]));
  expect(hasLabel(html, "NFT collections")).toBe(true);
  expect(hasLabel(html, "Loading NFTs")).toBe(true);
  expect(hasLabel(html, "Pagination")).toBe(true);
});

it("scopes the saved collection and page by network", () => {
  mockCollections = [];
  mockStateKeys.length = 0;
  render();

  expect(mockStateKeys).toEqual([
    "account:chain-a:g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5:nft-collection",
    "account:chain-a:g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5:nft-page",
  ]);
});

it("clamps a restored page that is past the last page", () => {
  mockCollections = [{ tokenId: "gno.land/r/demo/nft", name: "Demo", symbol: "DEMO", tokenCount: 20, ownedCount: 20 }];
  mockSavedPage = 9;
  mockRequestedPages.length = 0;
  render();
  mockSavedPage = undefined;

  expect(mockRequestedPages).toEqual([3]);
});
