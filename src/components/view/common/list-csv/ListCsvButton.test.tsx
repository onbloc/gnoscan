/** @jest-environment jsdom */
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { downloadCsv } from "@/common/utils/csv.utility";
import theme from "@/styles/theme";
import { ListCsvButton } from "./ListCsvButton";

jest.mock("@/assets/svgs/icon-download.svg", () => () => null);
jest.mock("@/common/utils/csv.utility", () => ({
  ...jest.requireActual("@/common/utils/csv.utility"),
  downloadCsv: jest.fn(),
}));

let container: HTMLDivElement;
let root: Root;

const csv: ListCsv = { name: "blocks", header: ["h", "n"], rows: [["a,b", 1]], page: 2, isSettled: true };

const render = (value: ListCsv | null) =>
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ListCsvButton csv={value} />
      </ThemeProvider>,
    ),
  );
const button = () => container.querySelector<HTMLButtonElement>("button")!;

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  (downloadCsv as jest.Mock).mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("ListCsvButton", () => {
  it("downloads the rows of the page on screen under the name of that page", () => {
    render(csv);

    act(() => button().click());

    expect(downloadCsv).toHaveBeenCalledWith("blocks_page-2.csv", 'h,n\r\n"a,b",1\r\n');
  });

  it("cannot download before the list reports, while the rows are those of another page, or without rows", () => {
    render(null);
    expect(button().disabled).toBe(true);

    render({ ...csv, isSettled: false });
    expect(button().disabled).toBe(true);

    render({ ...csv, rows: [] });
    expect(button().disabled).toBe(true);
  });
});
