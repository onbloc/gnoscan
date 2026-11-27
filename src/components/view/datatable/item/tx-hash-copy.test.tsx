/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { TxHashCopy } from "./tx-hash-copy";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => `${path}&chainId=testnet` }),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
jest.mock("@/assets/svgs/icon-copy.svg", () => () => null);
jest.mock("@gnolang/gno-js-client", () => ({ decodeTxMessages: jest.fn() }));
jest.mock("@gnolang/tm2-js-client", () => ({}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));

const hexHash = "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
const displayHexHash = "ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789";
const base64Hash = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=";
let container: HTMLDivElement;
let root: Root;
const render = (props: React.ComponentProps<typeof TxHashCopy>) =>
  act(() =>
    root.render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <TxHashCopy {...props} />
        </ThemeProvider>
      </RecoilRoot>,
    ),
  );

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

it("keeps table hashes abbreviated while linking to the complete canonical hash", () => {
  render({ txHash: hexHash });
  const link = container.querySelector("a")!;
  expect(link.textContent).toContain("...");
  expect(link.textContent).not.toBe(displayHexHash);
  expect(link.getAttribute("href")).toBe(`/transactions/details?txhash=${displayHexHash}&chainId=testnet`);
});

it.each([
  { kind: "hex", input: hexHash, expected: displayHexHash },
  { kind: "base64", input: base64Hash, expected: base64Hash },
])("shows the whole $kind hash without corrupting its transaction destination", ({ input, expected }) => {
  render({ txHash: input, ellipsis: false });
  const link = container.querySelector("a")!;
  expect(link.textContent).toBe(expected);
  expect(link.getAttribute("href")).toBe(`/transactions/details?txhash=${expected}&chainId=testnet`);
});
