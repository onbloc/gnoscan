import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import { AxiosError } from "axios";
import theme from "@/styles/theme";
import { StatisticsErrorNotice } from "./statistics-error-notice";

type Query = React.ComponentProps<typeof StatisticsErrorNotice>["query"];

const httpError = (status: number) =>
  new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never);

const render = (query: Partial<Query>) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <StatisticsErrorNotice query={{ data: undefined, error: null, isError: false, ...query }} />
    </ThemeProvider>,
  );

describe("StatisticsErrorNotice", () => {
  it("renders nothing while the statistic is available", () => {
    expect(render({})).toBe("");
  });

  it("tells a 404 apart from other failures", () => {
    expect(render({ error: httpError(404), isError: true })).toContain("Statistics are not available yet.");
    expect(render({ error: httpError(500), isError: true })).toContain("Statistics could not be loaded.");
    expect(render({ error: new Error("Network Error"), isError: true })).toContain("Statistics could not be loaded.");
  });
});
