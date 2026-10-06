import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { AddressCopy } from "./address-copy";

// Render the tooltip content inline so its text can be asserted.
jest.mock("@/components/ui/tooltip", () => {
  const MockTooltip = ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <>
      <div data-part="trigger">{children}</div>
      <div data-part="tooltip">{content}</div>
    </>
  );
  return { __esModule: true, default: MockTooltip, EllipsisTooltip: MockTooltip };
});
jest.mock("@/assets/svgs/icon-copy.svg", () => ({ __esModule: true, default: () => null }));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

const ADDRESS = "g1abcdefghijklmnopqrstuvwxyz0123456789";
const REALM_PATH = "gno.land/r/gnoland/wugnot";

const render = (props: React.ComponentProps<typeof AddressCopy>) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <AddressCopy {...props} />
    </ThemeProvider>,
  );

it("shows an unlabeled address as its first and last 8 characters linking to the account page", () => {
  const html = render({ address: ADDRESS, label: null, labelType: null });
  expect(html).toContain(`<a class="ellipsis" href="/account/${ADDRESS}">g1abcdef...23456789</a>`);
  expect(html).toContain(`<div data-part="tooltip">${ADDRESS}</div>`);
});

it("shows a realm address as its realm path linking to the realm page", () => {
  const html = render({ address: ADDRESS, label: REALM_PATH, labelType: "realm" });
  expect(html).toContain(`<a class="ellipsis" href="/realms/details?path=${REALM_PATH}">r/gnoland/wugnot</a>`);
  expect(html).toContain(`<div data-part="tooltip">${ADDRESS}</div>`);
});
