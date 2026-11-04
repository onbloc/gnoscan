/** @jest-environment jsdom */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { StandardNetworkTransactionContractDetails } from "./StandardNetworkTransactionContractsDetails";

jest.mock("@/components/ui/show-log", () => ({ __esModule: true, default: () => null }));

// Stands for the file viewer: it keeps the selected file like `ShowLog` does.
jest.mock("../transaction-message-card", () => {
  const { useState } = jest.requireActual("react");
  const Viewer = ({ files }: { files: { name: string; body: string }[] }) => {
    const [index, setIndex] = useState(0);
    return (
      <button data-testid="viewer" onClick={() => setIndex(1)}>
        {files[index].body}
      </button>
    );
  };
  return {
    StandardNetworkAddPackageMessage: Viewer,
    StandardNetworkBankMsgSendMessage: () => null,
    StandardNetworkCreateSessionMessage: () => null,
    StandardNetworkEnablePackageMessage: () => null,
    StandardNetworkMsgCallMessage: () => null,
    StandardNetworkMsgRunMessage: () => null,
    StandardNetworkRejectPackageMessage: () => null,
    StandardNetworkRevokeSessionMessage: () => null,
  };
});

const file = (name: string) => ({ name, body: `${name} body` });
// Message 0 has two files (page 1), message 40 has one (page 2); both are of the same type.
const messages: any[] = Array.from({ length: 41 }, () => ({ package: { files: [] } }));
messages[0] = { package: { files: [file("a.gno"), file("b.gno")] } };
messages[40] = { package: { files: [file("c.gno")] } };

const render = (root: ReturnType<typeof createRoot>, startIndex: number) =>
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <StandardNetworkTransactionContractDetails
          transactionItem={{ messages: [{ messageType: MESSAGE_TYPES.VM_ADDPKG }], numOfMessage: 41 } as any}
          rawTransaction={{ messages, rawContent: "" } as any}
          getUrlWithNetwork={uri => uri}
          startIndex={startIndex}
        />
      </ThemeProvider>,
    ),
  );

beforeAll(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
});

it("resets the selected file when another page replaces the first message", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  render(root, 0);
  act(() => container.querySelector<HTMLButtonElement>("[data-testid=viewer]")?.click());
  expect(container.textContent).toContain("b.gno body");

  render(root, 40);

  expect(container.textContent).toContain("c.gno body");
  act(() => root.unmount());
});
