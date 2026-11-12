/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { useAdoptSnapshotHeight, useSnapshotHeight } from "./use-snapshot-height";

let requested: (number | undefined)[] = [];
let response: { height?: number; isPreviousData: boolean } = { isPreviousData: false };

const Probe = ({ page }: { page: number }) => {
  const snapshot = useSnapshotHeight(page);
  requested.push(snapshot.height);
  useAdoptSnapshotHeight(snapshot.adopt, response.height, !response.isPreviousData);
  return null;
};

let root: ReturnType<typeof createRoot>;
const render = (page: number) => act(() => root.render(<Probe page={page} />));
const lastRequested = () => requested[requested.length - 1];

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

beforeEach(() => {
  requested = [];
  response = { isPreviousData: false };
  root = createRoot(document.createElement("div"));
});

afterEach(() => act(() => root.unmount()));

it("requests page 1 unpinned and pins later pages to the height page 1 reported", () => {
  render(1);
  expect(lastRequested()).toBeUndefined();

  response = { height: 100, isPreviousData: false };
  render(1);
  expect(lastRequested()).toBeUndefined();

  render(2);
  expect(lastRequested()).toBe(100);
  render(3);
  expect(lastRequested()).toBe(100);
});

it("picks up a newer height when page 1 is loaded again", () => {
  response = { height: 100, isPreviousData: false };
  render(1);
  render(2);

  render(1);
  expect(lastRequested()).toBeUndefined();
  response = { height: 120, isPreviousData: false };
  render(1);

  render(2);
  expect(lastRequested()).toBe(120);
});

it("does not adopt the height of a previous request while the next page loads", () => {
  response = { height: 100, isPreviousData: false };
  render(1);
  render(2);

  response = { height: 100, isPreviousData: true };
  render(2);
  render(1);
  response = { height: 90, isPreviousData: true };
  render(1);
  render(2);

  expect(lastRequested()).toBe(100);
});

it("keeps requesting a restored page unpinned instead of refetching it once its height is known", () => {
  render(3);
  expect(lastRequested()).toBeUndefined();

  response = { height: 100, isPreviousData: false };
  render(3);
  expect(lastRequested()).toBeUndefined();

  render(4);
  expect(lastRequested()).toBe(100);
});
