import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import AccountTransactionsSkeleton from "./AccountTransactionsSkeleton";

jest.mock(
  "@/assets/svgs/icon-table-loading.svg",
  () =>
    function MockTableLoading() {
      return <svg>table-loading</svg>;
    },
);
jest.mock("@/components/ui/tooltip", () => () => null);
jest.mock("@/assets/svgs/icon-tooltip.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-up.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-down.svg", () => () => null);

it("renders the transactions panel frame in its loading state", () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <AccountTransactionsSkeleton />
    </ThemeProvider>,
  );

  expect(html).toContain("Transactions");
  expect(html).toContain("Events");
  expect(html).toContain("Tx Hash");
  expect(html).toContain("table-loading");
  expect(html).not.toContain("No data to display");
});
