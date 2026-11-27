/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import type { GovernanceProposalDetail } from "@/models/api/governance";
import theme from "@/styles/theme";
import ProposalDetail from "./proposal-detail";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => path, gnoWebUrl: null }),
}));
jest.mock("@/components/ui/detail-field", () => ({
  Field: ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
    <dl>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </dl>
  ),
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({ AddressCopy: () => null }));
jest.mock("@/components/view/datatable/item/tx-hash-copy", () => ({ TxHashCopy: () => null }));
jest.mock("./proposal-markdown", () => ({ __esModule: true, default: () => null }));

const tally = { percent: 0, count: 0, power: 0 };
const proposal: GovernanceProposalDetail = {
  id: 31,
  title: "Proposal 31",
  type: "OTHER",
  status: "ACCEPTED",
  proposer: { address: null, nameTag: "alice" },
  votes: { yes: tally, no: tally, abstain: tally },
  description: "",
  eligibleTiers: [],
  executorPackagePath: null,
  newMember: null,
  createdTx: null,
  turnout: { castMembers: 0, eligibleMembers: null, castPowerPercent: null },
  prevId: null,
  nextId: null,
};
let container: HTMLDivElement;
let root: Root;

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

it.each([
  ["OTHER", "Other"],
  ["UPGRADE", "UPGRADE"],
  ["toString", "toString"],
  ["__proto__", "__proto__"],
  ["", "Unknown"],
])("renders proposal type %s without treating an unsupported type as Other", (type, label) => {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ProposalDetail proposal={{ ...proposal, type: type as GovernanceProposalDetail["type"] }} />
      </ThemeProvider>,
    ),
  );
  const field = Array.from(container.querySelectorAll("dl")).find(
    element => element.querySelector("dt")?.textContent === "Type",
  )!;
  expect(field.querySelector("dd")?.textContent).toBe(label);
});
