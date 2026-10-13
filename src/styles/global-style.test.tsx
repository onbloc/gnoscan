import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet, ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { GlobalStyle } from "./global-style";

it("disables the vertical overscroll bounce on html and body", () => {
  const sheet = new ServerStyleSheet();
  renderToString(
    sheet.collectStyles(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <GlobalStyle />
      </ThemeProvider>,
    ),
  );
  const css = sheet.getStyleTags();
  sheet.seal();

  expect(css).toMatch(/html,\s*body\s*\{[^}]*overscroll-behavior-y:\s*none/);
});
