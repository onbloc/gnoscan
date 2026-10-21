import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { EventAttributes } from "./event-attributes";

jest.mock("@/components/ui/tooltip", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderText = (attributes: { key: string; value: string }[]) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <EventAttributes attributes={attributes} />
    </ThemeProvider>,
  ).replace(/<[^>]*>/g, "");

it("shows a dash when the event has no attributes", () => {
  expect(renderText([])).toBe("-");
});

it("joins every attribute into a one-line key=value summary", () => {
  expect(
    renderText([
      { key: "from", value: "g1a" },
      { key: "to", value: "g1b" },
      { key: "value", value: "100" },
    ]),
  ).toBe("from=g1a, to=g1b, value=100");
});
