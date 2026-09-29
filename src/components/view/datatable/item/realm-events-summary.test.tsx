import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { ActivityEvent } from "@/models/api/activity/activity-model";
import { RealmEventsSummary } from "./realm-events-summary";

// Render the tooltip content inline so its text can be asserted.
jest.mock("@/components/ui/tooltip", () => ({
  __esModule: true,
  default: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <>
      <div data-part="trigger">{children}</div>
      <div data-part="tooltip">{content}</div>
    </>
  ),
}));

const event = (eventIndex: number, eventType: string): ActivityEvent => ({
  eventIndex,
  eventType,
  packagePath: "gno.land/r/gnoswap/pool",
  attributes: [],
});

const render = (events: ActivityEvent[]) => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <RealmEventsSummary events={events} />
    </ThemeProvider>,
  );
  const part = (name: string) =>
    (html.split(`data-part="${name}">`)[1] ?? "").split("<div data-part=")[0].replace(/<[^>]*>/g, "");
  return { trigger: part("trigger"), tooltip: part("tooltip") };
};

it("shows the first event with a +N count and lists every event type on hover", () => {
  const { trigger, tooltip } = render([event(1, "Swap"), event(3, "Transfer"), event(4, "StorageDepositEvent")]);
  expect(trigger).toBe("Swap+2");
  expect(tooltip).toContain("Swap");
  expect(tooltip).toContain("Transfer");
  expect(tooltip).toContain("StorageDepositEvent");
  expect(tooltip.indexOf("Swap")).toBeLessThan(tooltip.indexOf("Transfer"));
});

it("keeps a single event without a count", () => {
  const { trigger, tooltip } = render([event(0, "Swap")]);
  expect(trigger).toBe("Swap");
  expect(tooltip).toContain("Swap");
});
