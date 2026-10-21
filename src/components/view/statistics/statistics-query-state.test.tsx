import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import { AxiosError } from "axios";
import theme from "@/styles/theme";
import { StatisticsQueryState } from "./statistics-query-state";

// The real button barrel pulls in SVG assets that jest cannot load.
jest.mock("@/components/ui/button", () => ({
  Button: ({
    className,
    disabled,
    children,
  }: {
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
  }) => (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  ),
}));

type Query = React.ComponentProps<typeof StatisticsQueryState>["query"];

const httpError = (status: number) =>
  new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never);

const render = (query: Partial<Query>) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <StatisticsQueryState
        query={{ data: undefined, error: null, isError: false, isFetching: false, refetch: jest.fn(), ...query }}
      >
        <span>CONTENT</span>
      </StatisticsQueryState>
    </ThemeProvider>,
  );

describe("StatisticsQueryState", () => {
  it("renders only the content while the query has not failed", () => {
    const html = render({});

    expect(html).toContain("CONTENT");
    expect(html).not.toContain("Retry");
  });

  it("replaces the content with an unavailable notice on a 404 without data", () => {
    const html = render({ error: httpError(404), isError: true });

    expect(html).toContain("Statistics are not available yet.");
    expect(html).toContain("Retry");
    expect(html).not.toContain("CONTENT");
  });

  it("replaces the content with a load failure notice on other errors without data", () => {
    const html = render({ error: httpError(500), isError: true });

    expect(html).toContain("Unable to load statistics.");
    expect(html).not.toContain("CONTENT");
  });

  it("keeps previously loaded content next to a refresh failure notice", () => {
    const html = render({ data: {}, error: httpError(404), isError: true });

    expect(html).toContain("Refresh failed. Showing previously loaded data.");
    expect(html).toContain("CONTENT");
  });

  it("disables Retry while a retry is in flight", () => {
    const html = render({ error: httpError(500), isError: true, isFetching: true });

    expect(html).toContain("Retrying");
    expect(html).toContain("disabled");
  });
});
