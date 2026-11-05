/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useShownPage } from "./use-shown-page";

let shown: number;
const Probe = ({ page, isPreviousData }: { page: number; isPreviousData: boolean }) => {
  shown = useShownPage(page, isPreviousData);
  return null;
};

let root: ReturnType<typeof createRoot>;
const render = (page: number, isPreviousData: boolean) =>
  act(() => root.render(<Probe page={page} isPreviousData={isPreviousData} />));

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  root = createRoot(document.createElement("div"));
});

afterEach(() => act(() => root.unmount()));

it("keeps the page of the rows on screen while the next page loads", () => {
  render(1, false);
  render(2, true);
  expect(shown).toBe(1);

  // Another request starts before the first one settles: the rows are still the ones of page 1.
  render(3, true);
  expect(shown).toBe(1);

  render(3, false);
  expect(shown).toBe(3);
});

it("follows the page at once when its rows are already loaded", () => {
  render(1, false);
  render(2, false);

  expect(shown).toBe(2);
});
