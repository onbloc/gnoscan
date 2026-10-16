import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { SearchResult } from "@/repositories/api/search/response";
import { SearchResultItem } from "./SearchResultItem";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

jest.mock("@/common/utils/transaction.utility", () => ({
  toDisplayHash: (hash: string) => hash,
}));

// The search API's GRC20 `link` holds the token name (e.g. "/tokens/Gnoswap"), not a routable token key.
const gns: SearchResult = {
  title: "gno.land/r/gnoswap/gns",
  description: "GNS",
  link: "/tokens/Gnoswap",
  type: SEARCH_RESULT_TYPE.TOKEN,
};

const render = (item: SearchResult) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <SearchResultItem item={item} onClick={() => undefined} />
    </ThemeProvider>,
  );

const renderHref = (item: SearchResult) => render(item).match(/href="([^"]*)"/)?.[1];

const renderText = (item: SearchResult) => render(item).replace(/<[^>]*>/g, "");

describe("SearchResultItem", () => {
  it("links a token result to its package path and symbol, ignoring the API link", () => {
    expect(renderHref(gns)).toBe("/tokens/gno.land/r/gnoswap/gns.GNS");
  });

  it("keeps the symbol for a realm hosting several tokens", () => {
    expect(renderHref({ ...gns, title: "gno.land/r/demo/defi/grc20factory", description: "PERUN" })).toBe(
      "/tokens/gno.land/r/demo/defi/grc20factory.PERUN",
    );
  });

  it("falls back to the package path when the symbol is missing", () => {
    expect(renderHref({ ...gns, description: "" })).toBe("/tokens/gno.land/r/gnoswap/gns");
  });

  it("shows the symbol next to the token path", () => {
    expect(renderText(gns)).toBe("r/gnoswap/gns (GNS)");
  });

  it("does not show the API link when the symbol is missing", () => {
    expect(renderText({ ...gns, description: "" })).toBe("r/gnoswap/gns");
  });
});
