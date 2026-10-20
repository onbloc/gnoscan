import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import StandardNetworkAccountNfts from "./StandardNetworkAccountNfts";

jest.mock("../account-address/AccountAddress.styles", () => ({
  CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));
jest.mock("./AccountNftCard", () => () => null);
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: (_key: string, initial: string) => [initial, jest.fn()],
}));
jest.mock("@/common/hooks/nft/use-nft-artwork", () => ({ useNftArtwork: () => () => ({}) }));
jest.mock("@/common/react-query/account/api/use-get-account-grc721-collections", () => ({
  useGetAccountGRC721Collections: () => ({ data: { items: [] }, isFetched: true }),
}));
jest.mock("@/common/react-query/account/api/use-get-account-nfts", () => ({
  useGetAccountNfts: () => ({ data: undefined, isFetched: false }),
}));
jest.mock("@/components/ui/pagination", () => ({ Pagination: () => <nav>pagination</nav> }));

it("shows an empty NFTs card for accounts without NFTs", () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <StandardNetworkAccountNfts address="g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5" />
    </ThemeProvider>,
  );

  expect(html).toContain("NFTs");
  expect(html).toContain(">0<");
  expect(html).toContain("No data to display");
  expect(html).not.toContain("Loading NFTs");
  expect(html).not.toContain("NFT collections");
  expect(html).not.toContain("pagination");
});
