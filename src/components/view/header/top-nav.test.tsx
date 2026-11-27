/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { TopNav } from "./top-nav";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return {
    themeState: atom({ key: "topNavThemeState", default: "light" }),
    searchState: atom({ key: "topNavSearchState", default: "" }),
  };
});
jest.mock("@/common/hooks/common/use-router", () => ({
  useRouter: () => ({ route: "/account/example" }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ chains: [] }),
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => path }),
}));
jest.mock("@/components/ui/input", () => ({ SubInput: () => null }));
jest.mock("@/components/ui/network", () => () => null);
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    onClick,
    className,
    "aria-label": label,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a
      href={href}
      className={className}
      aria-label={label}
      onClick={event => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));
jest.mock("@/assets/svgs/icon-gnoscan-logo-light.svg", () => () => null);
jest.mock("@/assets/svgs/icon-gnoscan-logo.svg", () => () => null);
jest.mock("@/assets/svgs/icon-menu-button.svg", () => () => null);
jest.mock("@/assets/svgs/icon-close.svg", () => () => null);
jest.mock("@/assets/svgs/icon-chevron.svg", () => () => null);

let container: HTMLDivElement;
let modalRoot: HTMLDivElement;
let root: Root;
const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();
const trigger = () => container.querySelector<HTMLButtonElement>("button[aria-label='Open menu']")!;
const click = (selector: string) => act(() => document.querySelector<HTMLElement>(selector)!.click());
const escape = () => act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
const expectUnlocked = () => {
  expect(trigger().getAttribute("aria-expanded")).toBe("false");
  expect(document.body.style.overflow).toBe("");
  expect(container.hasAttribute("inert")).toBe(false);
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  jest.useFakeTimers();
  mediaListeners.clear();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn(
      query =>
        ({
          media: query,
          matches: false,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
          addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => mediaListeners.add(listener),
          removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
            mediaListeners.delete(listener),
        } as MediaQueryList),
    ),
  });
  container = document.createElement("div");
  container.id = "__next";
  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.append(container, modalRoot);
  root = createRoot(container);
  act(() =>
    root.render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <TopNav />
        </ThemeProvider>
      </RecoilRoot>,
    ),
  );
  act(() => trigger().click());
  expect(document.body.style.overflow).toBe("hidden");
  expect(container.hasAttribute("inert")).toBe(true);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  modalRoot.remove();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it.each(["resize", "Escape", "repeat selection"])(
  "keeps the page unlocked when a menu selection overlaps %s",
  action => {
    click("#modal-root a[href='/accounts']");
    if (action === "resize") {
      act(() => mediaListeners.forEach(listener => listener({ matches: true } as MediaQueryListEvent)));
    } else if (action === "Escape") {
      escape();
    } else {
      click("#modal-root a[href='/accounts']");
    }
    act(() => jest.runOnlyPendingTimers());
    expectUnlocked();
  },
);

it.each(["button", "Escape"])("closes with %s and returns focus to the menu trigger", action => {
  expect(document.activeElement).toBe(modalRoot.querySelector("button[aria-label='Close menu']"));
  if (action === "button") click("#modal-root button[aria-label='Close menu']");
  else escape();
  act(() => jest.runOnlyPendingTimers());
  expectUnlocked();
  expect(document.activeElement).toBe(trigger());
});

it.each(["click", "Escape"])("returns focus to the menu trigger when %s closes from a focused link", action => {
  const link = modalRoot.querySelector<HTMLAnchorElement>("a[href='/accounts']")!;
  act(() => link.focus());
  if (action === "click") click("#modal-root a[href='/accounts']");
  else escape();
  expectUnlocked();
  expect(document.activeElement).toBe(trigger());
});

it("opens Governance from the desktop dropdown and mobile menu", () => {
  const mobileLink = modalRoot.querySelector<HTMLAnchorElement>("a[href='/governance']")!;
  expect(mobileLink.textContent).toBe("Governance");
  act(() => mobileLink.click());
  expectUnlocked();

  const desktopTrigger = Array.from(container.querySelectorAll("button")).find(
    button => button.textContent === "Blockchain",
  )!;
  act(() => desktopTrigger.click());
  const desktopLink = container.querySelector<HTMLAnchorElement>("a[href='/governance']")!;
  expect(desktopLink.textContent).toBe("Governance");
  act(() => desktopLink.click());
  expect(desktopTrigger.getAttribute("aria-expanded")).toBe("false");
});
