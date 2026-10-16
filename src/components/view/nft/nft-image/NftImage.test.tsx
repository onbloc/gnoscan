/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import NftImage from "./NftImage";

jest.mock(
  "@/assets/svgs/icon-table-loading.svg",
  () =>
    function MockTableLoading() {
      return <svg />;
    },
);

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
});

function render(src?: string, isLoading = false) {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <NftImage src={src} isLoading={isLoading} alt="Token artwork" />
      </ThemeProvider>,
    ),
  );
}

function dispatch(image: HTMLImageElement, event: "load" | "error") {
  act(() => image.dispatchEvent(new Event(event)));
}

it("loads the mounted media before revealing it and preserves loaded artwork during resolver refresh", () => {
  render("https://example.org/one.png", true);
  const image = container.querySelector("img")!;
  expect(image.style.visibility).toBe("hidden");
  expect(container.querySelector("[role=status]")?.getAttribute("aria-label")).toBe("Loading NFT artwork");
  expect(container.querySelector(".nft-default-icon")).toBeNull();

  dispatch(image, "load");
  expect(image.style.visibility).toBe("visible");
  expect(container.querySelector("[role=status]")).toBeNull();
  render("https://example.org/one.png", true);
  expect(container.querySelector("img")).toBe(image);
  expect(image.style.visibility).toBe("visible");
  expect(container.querySelector("[role=status]")).toBeNull();
});

it("uses the loader for a missing pending source and the placeholder once lookup finishes without artwork", () => {
  render(undefined, true);
  expect(container.querySelector("[role=status]")).not.toBeNull();
  expect(container.querySelector(".nft-default-icon")).toBeNull();
  render(undefined, false);
  expect(container.querySelector("[role=status]")).toBeNull();
  expect(container.querySelector(".nft-default-icon")).not.toBeNull();
});

it("resets on source changes, ignores obsolete image events, and ends terminal media errors", () => {
  render("https://example.org/one.png");
  const obsolete = container.querySelector("img")!;
  dispatch(obsolete, "load");
  render("https://example.org/two.png");
  const current = container.querySelector("img")!;
  expect(current).not.toBe(obsolete);
  expect(current.style.visibility).toBe("hidden");
  dispatch(obsolete, "error");
  dispatch(obsolete, "load");
  expect(container.querySelector("[role=status]")).not.toBeNull();
  expect(current.style.visibility).toBe("hidden");

  dispatch(current, "error");
  expect(container.querySelector("[role=status]")).toBeNull();
  expect(container.querySelector(".nft-default-icon")).not.toBeNull();
  render("https://example.org/two.png", true);
  expect(container.querySelector("[role=status]")).toBeNull();
  render("https://example.org/one.png");
  expect(container.querySelector("[role=status]")).not.toBeNull();
  dispatch(container.querySelector("img")!, "load");
  expect(container.querySelector("[role=status]")).toBeNull();
});

it("reveals an already complete cached image without waiting for another load event", () => {
  jest.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  jest.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(640);
  render("https://example.org/cached.png");
  expect(container.querySelector("img")?.style.visibility).toBe("visible");
  expect(container.querySelector("[role=status]")).toBeNull();
  expect(container.querySelector(".nft-default-icon")).toBeNull();
});

it("uses the placeholder for an already complete failed image", () => {
  jest.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  jest.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(0);
  render("https://example.org/failed.png", true);
  expect(container.querySelector("img")).toBeNull();
  expect(container.querySelector("[role=status]")).toBeNull();
  expect(container.querySelector(".nft-default-icon")).not.toBeNull();
});
