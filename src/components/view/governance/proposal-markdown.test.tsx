/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import ProposalMarkdown from "./proposal-markdown";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = (description: string, gnoWebUrl: string | null = "https://testnet.gno.land") => {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ProposalMarkdown description={description} gnoWebUrl={gnoWebUrl} />
      </ThemeProvider>,
    ),
  );
};

it("renders formatted Markdown and resolves realm and user links against the selected network", () => {
  render("**Proposal**\n\n[GovDAO](/r/gov/dao) and [@alice](/u/alice) and [Docs](https://docs.gno.land/)");
  expect(container.querySelector("strong")?.textContent).toBe("Proposal");
  const links = Array.from(container.querySelectorAll("a"));
  expect(links.map(link => link.href)).toEqual([
    "https://testnet.gno.land/r/gov/dao",
    "https://testnet.gno.land/u/alice",
    "https://docs.gno.land/",
  ]);
  links.forEach(link => {
    expect(link.target).toBe("_blank");
    expect(link.rel).toBe("noopener noreferrer");
  });
});

it("removes raw HTML and script blocks rather than interpreting proposal HTML", () => {
  render('<script>window.proposalScript = true</script>\n\n<img src="x" onerror="alert(1)">\n\n**Safe text**');
  expect(container.querySelector("script, img")).toBeNull();
  expect(container.textContent).not.toContain("window.proposalScript");
  expect(container.querySelector("strong")?.textContent).toBe("Safe text");
});

it("keeps labels but does not create links or images with unsafe URL schemes", () => {
  render(
    "[JavaScript](javascript:alert%281%29) [Data](data:text/html,unsafe) [Other](vbscript:unsafe) ![Unsafe image](data:image/svg+xml,unsafe)",
  );
  expect(container.querySelector("a, img")).toBeNull();
  expect(container.textContent).toContain("JavaScript");
  expect(container.textContent).toContain("Data");
  expect(container.textContent).toContain("Other");
});

it("does not route relative realm links into the explorer when the network base is missing", () => {
  render("[GovDAO](/r/gov/dao) and [Docs](https://docs.gno.land/)", null);
  expect(container.textContent).toContain("GovDAO");
  expect(container.querySelectorAll("a")).toHaveLength(1);
  expect(container.querySelector("a")?.href).toBe("https://docs.gno.land/");
});

it("updates relative destinations when the network changes", () => {
  render("[GovDAO](/r/gov/dao)", "https://gno.land");
  expect(container.querySelector("a")?.href).toBe("https://gno.land/r/gov/dao");
  render("[GovDAO](/r/gov/dao)", "https://testnet.gno.land");
  expect(container.querySelector("a")?.href).toBe("https://testnet.gno.land/r/gov/dao");
});

it("retains external and network-relative images without sending the explorer referrer", () => {
  render("![External](https://images.example.org/proposal.png) ![Realm](/r/gov/dao/banner.png)");
  const images = Array.from(container.querySelectorAll("img"));
  expect(images.map(image => image.src)).toEqual([
    "https://images.example.org/proposal.png",
    "https://testnet.gno.land/r/gov/dao/banner.png",
  ]);
  images.forEach(image => {
    expect(image.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(image.getAttribute("loading")).toBe("lazy");
  });
});
