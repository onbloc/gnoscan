import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import ValidatorTable from "./ValidatorTable";

jest.mock("@/assets/svgs/icon-link.svg", () => () => null);
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => path, gnoWebUrl: "https://gno.example" }),
}));
jest.mock("@/components/ui/tooltip", () => {
  const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return Tooltip;
});

const render = (validators: React.ComponentProps<typeof ValidatorTable>["validators"]) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <ValidatorTable
        validators={validators}
        commits={[]}
        fromHeight={null}
        toHeight={null}
        commitSize={20}
        footer={<nav aria-label="Pagination" />}
      />
    </ThemeProvider>,
  );

it("keeps the footer when the page has no validators, so the user can leave an empty page", () => {
  const html = render([]);

  expect(html).toContain("No data to display");
  expect(html).toMatch(/aria-label="Pagination"/);
});
