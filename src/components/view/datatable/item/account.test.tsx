import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { Account } from "./account";

jest.mock("@/components/ui/tooltip", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));
const mockGetName = jest.fn<string | undefined, [string]>(() => undefined);
jest.mock("@/common/hooks/account/use-username", () => ({
  useUsername: () => ({ getName: mockGetName }),
}));

const ADDRESS = "g1abcdefghijklmnopqrstuvwxyz0123456789";
const REALM_PATH = "gno.land/r/gnoland/wugnot";

const render = (props: React.ComponentProps<typeof Account>) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <Account {...props} />
    </ThemeProvider>,
  );

beforeEach(() => mockGetName.mockReturnValue(undefined));

it("shows an entity or exchange label linking to the account page", () => {
  const html = render({ address: ADDRESS, label: "Kraken #1", labelType: ADDRESS_LABEL_TYPE.EXCHANGE });
  expect(html).toContain(`href="/account/${ADDRESS}">Kraken #1</a>`);
});

it("shows a realm label as its path linking to the realm page", () => {
  const html = render({ address: ADDRESS, label: REALM_PATH, labelType: ADDRESS_LABEL_TYPE.REALM });
  expect(html).toContain(`href="/realms/details?path=${REALM_PATH}">r/gnoland/wugnot</a>`);
});

it("falls back to the shortened address without a label", () => {
  const html = render({ address: ADDRESS });
  expect(html).toContain(`href="/account/${ADDRESS}">g1abcd...456789</a>`);
});

it("keeps a resolved username ahead of the label", () => {
  mockGetName.mockReturnValue("alice");
  const html = render({ address: ADDRESS, label: "Kraken #1", labelType: ADDRESS_LABEL_TYPE.EXCHANGE });
  expect(html).toContain(`href="/account/${ADDRESS}">alice</a>`);
});
