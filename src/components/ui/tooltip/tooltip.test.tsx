import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RecoilRoot } from "recoil";
import { ServerStyleSheet } from "styled-components";
import { EllipsisTooltip } from "./tooltip";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

it("bounds the ellipsis tooltip to its container so long text can shrink", () => {
  const sheet = new ServerStyleSheet();
  try {
    renderToStaticMarkup(
      sheet.collectStyles(
        <RecoilRoot>
          <EllipsisTooltip content="g1abcdefghijklmnopqrstuvwxyz0123456789">
            <a className="ellipsis">r/gnoland/very_long_realm_name</a>
          </EllipsisTooltip>
        </RecoilRoot>,
      ),
    );
    const css = sheet.getStyleTags().replace(/\s/g, "");
    expect(css).toContain("max-width:100%;min-width:0;");
    expect(css).toMatch(/\.tooltip-button,[^{]*a\{min-width:0;\}/);
  } finally {
    sheet.seal();
  }
});
