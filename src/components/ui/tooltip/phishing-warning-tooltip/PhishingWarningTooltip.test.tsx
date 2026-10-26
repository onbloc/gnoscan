/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { PHISHING_AFFECTED_WALLETS_URL, PHISHING_REPORT_SOURCE_URL } from "@/common/values/url.constant";
import { PhishingWarningTooltip, WithPhishingWarning } from "./PhishingWarningTooltip";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

const WARNING_LABEL = "Phishing warning";
const ADDRESS = "g1abc";

const mount = (element: React.ReactElement) => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<RecoilRoot>{element}</RecoilRoot>));
  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

afterEach(() => {
  jest.useRealTimers();
});

it("renders nothing for an address that is not flagged", () => {
  const view = mount(<PhishingWarningTooltip labelType={ADDRESS_LABEL_TYPE.EXCHANGE} />);
  expect(view.container.querySelector(`[aria-label^="${WARNING_LABEL}"]`)).toBeNull();
  view.unmount();
});

it("shows the warning icon for a scam address and opens the report details on keyboard focus", () => {
  jest.useFakeTimers();
  const view = mount(<PhishingWarningTooltip labelType={ADDRESS_LABEL_TYPE.SCAM} />);
  const icon = view.container.querySelector<HTMLElement>(`[aria-label^="${WARNING_LABEL}"]`);
  expect(icon?.getAttribute("role")).toBe("button");
  expect(icon).not.toBeNull();

  act(() => {
    icon!.focus();
    jest.runAllTimers();
  });

  expect(document.body.textContent).toContain("Do not send funds to this address.");
  const links = Array.from(document.body.querySelectorAll<HTMLAnchorElement>(".ant-tooltip a"));
  expect(links.map(link => link.href)).toEqual([PHISHING_REPORT_SOURCE_URL, PHISHING_AFFECTED_WALLETS_URL]);
  links.forEach(link => {
    expect(link.target).toBe("_blank");
    expect(link.rel).toContain("noopener");
  });
  view.unmount();
});

it("keeps the address element and appends the warning only for flagged addresses", () => {
  const flagged = mount(
    <WithPhishingWarning labelType={ADDRESS_LABEL_TYPE.SCAM}>
      <a href={`/account/${ADDRESS}`}>Phishing #1</a>
    </WithPhishingWarning>,
  );
  expect(
    flagged.container.querySelector("a")?.nextElementSibling?.querySelector(`[aria-label^="${WARNING_LABEL}"]`),
  ).not.toBeNull();
  flagged.unmount();

  const plain = mount(
    <WithPhishingWarning labelType={ADDRESS_LABEL_TYPE.ENTITY}>
      <a href={`/account/${ADDRESS}`}>Entity</a>
    </WithPhishingWarning>,
  );
  expect(plain.container.innerHTML).toBe(`<a href="/account/${ADDRESS}">Entity</a>`);
  plain.unmount();
});
