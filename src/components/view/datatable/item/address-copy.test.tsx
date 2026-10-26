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
// The warning renders through the base tooltip; show its content inline too.
jest.mock("@/components/ui/tooltip/tooltip", () => ({
  __esModule: true,
  default: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <>
      <div data-part="trigger">{children}</div>
      <div data-part="tooltip">{content}</div>
    </>
  ),
}));
jest.mock("@/assets/svgs/icon-copy.svg", () => ({ __esModule: true, default: () => null }));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

const WARNING_LABEL = "Phishing warning";
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

it("shortens a nested realm label without changing its canonical destination", () => {
  const realmPath = "gno.land/r/g1t2kg2vtr3fukg43eujkn6x53gfdyakhngt4sfd/gnofly/nfts/market/bazaar/v1/gnofly";
  const html = render({
    address: ADDRESS,
    label: realmPath,
    labelType: "realm",
    truncateFromStart: true,
  });
  expect(html).toContain("r/g1t2...4sfd/gnofly/nfts/market/bazaar/v1/gnofly");
  expect(html).toContain(`href="/realms/details?path=${realmPath}"`);
});

it("adds the phishing warning for a scam label and keeps it out for other labels", () => {
  const scam = render({ address: ADDRESS, label: "Phishing #1", labelType: "scam" });
  expect(scam).toContain(`aria-label="${WARNING_LABEL}`);
  expect(scam).toContain("Do not send funds to this address.");
  expect(scam).toContain(`href="/account/${ADDRESS}">Phishing #1</a>`);

  expect(render({ address: ADDRESS, label: "Kraken #1", labelType: "exchange" })).not.toContain("Phishing warning");
});
