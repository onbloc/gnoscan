/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";
import { ThemeProvider } from "styled-components";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { GetNftCollectionItemsResponse, GetNftTokenUrisResponse } from "@/repositories/api/token/response";
import NftImage from "@/components/view/nft/nft-image/NftImage";
import theme from "@/styles/theme";
import { useNftInventoryControls } from "./use-nft-inventory-controls";
import { useNftArtwork } from "./use-nft-artwork";

const mockRepository = { getNftCollectionItems: jest.fn(), getNftTokenUris: jest.fn() };
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockRepository }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test-chain" } }),
}));

// Support TS 4.9 and Node runtimes that do not expose Promise.withResolvers.
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

it("keeps cards, artwork, and pagination visible while expanding, without leaking another collection", async () => {
  const path = "gno.land/r/example/nfts";
  const tokenKey = `${path}.NFT.0000000`;
  const items = Array.from({ length: 22 }, (_, index) => ({
    tokenId: tokenKey,
    packagePath: path,
    nftId: String(index + 1),
    ownerAddress: "g1owner",
    operatorAddress: "",
  }));
  const initial: GetNftCollectionItemsResponse = {
    items: items.slice(0, 20),
    page: { hasNext: true, totalCount: 100 },
  };
  const expanded: GetNftCollectionItemsResponse = { items, page: { hasNext: true, totalCount: 100 } };
  const artwork: GetNftTokenUrisResponse = {
    items: items.map(item => ({
      tokenId: item.nftId,
      uri: `https://example.org/${item.nftId}.png`,
      status: "found",
      needsRefetch: false,
    })),
  };
  const pageRequest = deferred<GetNftCollectionItemsResponse>();
  const artworkRequest = deferred<GetNftTokenUrisResponse>();
  const otherRequest = deferred<GetNftCollectionItemsResponse>();
  const nextPageRequest = deferred<GetNftCollectionItemsResponse>();
  mockRepository.getNftCollectionItems.mockImplementation(({ tokenKey: key, page }) =>
    key !== tokenKey ? otherRequest.promise : page === 2 ? nextPageRequest.promise : pageRequest.promise,
  );
  mockRepository.getNftTokenUris.mockReturnValue(artworkRequest.promise);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, cacheTime: Infinity } },
  });
  client.setQueryData(["test-chain", QUERY_KEY.getNftCollectionItems, { tokenKey, limit: 20, page: 1 }], initial);
  client.setQueryData(
    ["test-chain", QUERY_KEY.getNftTokenUris, [{ packagePath: path, tokenIds: initial.items.map(item => item.nftId) }]],
    artwork.items.slice(0, 20).map(item => ({ ...item, packagePath: path })),
  );

  function Inventory({ collection, limit }: { collection: string; limit: number }) {
    const view = useNftInventoryControls(collection, limit);
    const image = useNftArtwork(view.items);
    return (
      <section>
        <output>
          {view.page}/{view.totalPages}
        </output>
        <button onClick={() => view.onChangePage(view.page + 1)}>Next page</button>
        {!view.isFetched ? (
          <p>Loading NFTs</p>
        ) : (
          view.items.map(item => (
            <article key={item.nftId}>
              <NftImage alt={`Token ${item.nftId}`} src={image(item.packagePath, item.nftId)} />
            </article>
          ))
        )}
      </section>
    );
  }
  const container = document.createElement("div");
  const root = createRoot(container);
  const render = (collection: string, limit: number) =>
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <Inventory collection={collection} limit={limit} />
          </ThemeProvider>
        </QueryClientProvider>,
      ),
    );
  try {
    render(tokenKey, 20);
    const originalImage = container.querySelector("img");
    render(tokenKey, 22);
    expect(container.querySelectorAll("article")).toHaveLength(20);
    expect(container.querySelectorAll("img")).toHaveLength(20);
    expect(container.querySelector("img")).toBe(originalImage);
    expect(container.querySelector("output")?.textContent).toBe("1/5");
    await act(async () => {
      pageRequest.resolve(expanded);
    });
    await act(async () => {
      await delay(0);
    });
    expect(container.querySelectorAll("article")).toHaveLength(22);
    expect(container.querySelectorAll("img")).toHaveLength(20);
    expect(container.querySelector("img")).toBe(originalImage);
    await act(async () => {
      artworkRequest.resolve({
        items: artwork.items.map((item, index) =>
          index === 0 ? { ...item, uri: "", status: "unavailable", needsRefetch: true } : item,
        ),
      });
    });
    await act(async () => {
      await delay(0);
    });
    expect(container.querySelectorAll("img")).toHaveLength(22);
    expect(container.querySelector("img")).toBe(originalImage);
    expect(originalImage?.getAttribute("src")).toBe("https://example.org/1.png");
    act(() => {
      client.setQueryData(
        ["test-chain", QUERY_KEY.getNftTokenUris, [{ packagePath: path, tokenIds: items.map(item => item.nftId) }]],
        artwork.items.map((item, index) => ({
          ...item,
          packagePath: path,
          ...(index === 0 ? { uri: "", status: "not_set" } : {}),
        })),
      );
    });
    await act(async () => {
      await delay(0);
    });
    expect(container.querySelector("article")?.querySelector("img")).toBeNull();
    act(() => container.querySelector("button")!.click());
    expect(container.querySelectorAll("article")).toHaveLength(0);
    expect(container.textContent).toContain("Loading NFTs");
    expect(container.querySelector("output")?.textContent).toBe("2/5");
    render("gno.land/r/other/nfts.NFT.0000000", 22);
    expect(container.querySelectorAll("article")).toHaveLength(0);
    expect(container.textContent).toContain("Loading NFTs");
    expect(container.querySelector("output")?.textContent).toBe("1/1");
  } finally {
    act(() => root.unmount());
    client.clear();
  }
});
