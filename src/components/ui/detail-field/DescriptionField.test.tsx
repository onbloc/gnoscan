import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { DescriptionField } from "./DescriptionField";

jest.mock("@/assets/svgs/icon-link.svg", () => "svg");
jest.mock("./DetailField", () => ({
  Field: ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <dl className={className}>{children}</dl>
  ),
}));

const renderField = (description?: string) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <DescriptionField description={description} />
    </ThemeProvider>,
  );

it("shows the token resource description", () => {
  const markup = renderField("GNFT is the GnoSwap liquidity position NFT.");
  expect(markup).toContain("GNFT is the GnoSwap liquidity position NFT.");
  expect(markup).not.toContain("Add in Gno.land Token Resources");
  // Inline, so the token layout's fixed badge height cannot clip wrapped text.
  expect(markup).toContain("height:auto");
  // The label stays on the first line of a wrapped description.
  expect(markup).toContain('class="top-aligned"');
});

it.each([undefined, "", "   "])("links to the token resources when the description is %p", description => {
  const markup = renderField(description);
  expect(markup).toContain("Add in Gno.land Token Resources");
  expect(markup).toContain("https://github.com/onbloc/gno-token-resource");
});
