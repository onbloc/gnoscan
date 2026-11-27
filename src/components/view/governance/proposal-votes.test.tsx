/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { GovernanceVote } from "@/models/api/governance";
import ProposalVotes from "./proposal-votes";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({ AddressCopy: () => null }));
jest.mock("@/components/view/datatable/item/tx-hash-copy", () => ({
  TxHashCopy: ({ txHash }: { txHash: string }) => <a href={`/transactions/details?txhash=${txHash}`}>{txHash}</a>,
}));
jest.mock(
  "@/components/view/common/table-skeleton/TableSkeleton",
  () =>
    function TableSkeleton() {
      return <div>Loading votes</div>;
    },
);
jest.mock("@/components/view/common/list-pagination/ListPagination", () => ({
  ListPagination: () => <nav aria-label="Vote pagination" />,
}));

let container: HTMLDivElement;
let root: Root;
const vote: GovernanceVote = {
  voter: { address: null, nameTag: "alice" },
  tier: "T1",
  choice: "YES",
  power: 1.25,
  txHash: null,
  votedAt: "2026-11-25T05:02:11Z",
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = (votes: GovernanceVote[], isError = false) => {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ProposalVotes
          votes={votes}
          totalCount={votes.length}
          isLoading={false}
          isError={isError}
          onRetry={jest.fn()}
          pagination={{
            page: 1,
            pageSize: 40,
            totalCount: votes.length,
            isSettled: !isError,
            scope: "20",
            onChangePage: jest.fn(),
          }}
        />
      </ThemeProvider>,
    ),
  );
};

it("keeps an unresolved voter unlinked and suppresses both transaction and time when no transaction was found", () => {
  render([vote]);
  const cells = container.querySelectorAll("tbody td");
  expect(cells[0].textContent).toBe("@alice");
  expect(cells[0].querySelector("a, button")).toBeNull();
  expect(cells[3].textContent).toBe("1.25");
  expect(cells[4].textContent).toBe("-");
  expect(cells[5].textContent).toBe("-");
});

it("shows absolute vote times only for transactions with a known timestamp", () => {
  render([
    { ...vote, txHash: "ABC" },
    { ...vote, txHash: "DEF", votedAt: null },
  ]);
  const rows = container.querySelectorAll("tbody tr");
  expect(rows[0].querySelector("a")?.getAttribute("href")).toBe("/transactions/details?txhash=ABC");
  expect(rows[0].querySelectorAll("td")[5].textContent).toMatch(/^2026-11-\d{2} \d{2}:\d{2}:\d{2}$/);
  expect(rows[0].querySelectorAll("td")[5].textContent).not.toContain("ago");
  expect(rows[1].querySelectorAll("td")[5].textContent).toBe("-");
});

it("keeps malformed nonempty timestamps out of the vote table", () => {
  render([{ ...vote, txHash: "ABC", votedAt: "not-a-date" }]);
  const cells = container.querySelectorAll("tbody td");
  expect(cells[4].querySelector("a")?.textContent).toBe("ABC");
  expect(cells[5].textContent).toBe("-");
  expect(container.textContent).not.toContain("Invalid Date");
});

it("preserves local interpretation and the absolute format for timezone-free timestamps", () => {
  render([{ ...vote, txHash: "ABC", votedAt: "2026-11-25T05:02:11" }]);
  expect(container.querySelectorAll("tbody td")[5].textContent).toBe("2026-11-25 05:02:11");
});

it("distinguishes a failed vote request from an empty vote list", () => {
  render([], true);
  expect(container.querySelector('[role="alert"]')?.textContent).toContain("Unable to load votes");
  expect(container.textContent).not.toContain("No votes yet");
  expect(container.querySelector("nav[aria-label='Vote pagination']")).not.toBeNull();
  render([]);
  expect(container.textContent).toContain("No votes yet");
});
