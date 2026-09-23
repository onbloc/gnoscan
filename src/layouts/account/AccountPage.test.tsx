import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "@/pages/account/[address]";

const address = "g1juss2tuc97sr77rn6vprhh9lr7d9e07uu68x59";
const mockRouter = { isReady: true, query: { address }, replace: jest.fn() };
let mockNetwork: { currentNetwork: { chainId: string } | null; isCustomNetwork: boolean };
let mockAccount: {
  isFetched: boolean;
  data?: { data: { address: string; name?: string; label?: string; labelType?: string } };
};

jest.mock("next/router", () => ({ useRouter: () => mockRouter }));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({ useNetworkProvider: () => mockNetwork }));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));
jest.mock("@/common/react-query/account/api/use-get-account-by-address", () => ({
  useGetAccountByAddress: () => mockAccount,
}));
jest.mock("@/common/react-query/validator/api", () => ({
  useGetValidatorByAddress: () => ({ isFetched: true }),
}));
jest.mock("@/common/utils/token.utility", () => ({
  stripGnoLandPrefix: (value: string) => value.replace(/^gno\.land\//, ""),
}));
jest.mock(
  "@/layouts/account/AccountLayout",
  () =>
    function MockAccountLayout() {
      return <main>Account details</main>;
    },
);
jest.mock("@/containers/account/account-address-container/AccountAddressContainer", () => () => null);
jest.mock("@/containers/account/account-assets-container/AccountAssetsContainer", () => () => null);
jest.mock("@/containers/account/account-transactions-container/AccountTransactionsContainer", () => () => null);
jest.mock(
  "@/components/view/loading/page",
  () =>
    function MockLoadingPage() {
      return <div role="status">Loading</div>;
    },
);

beforeEach(() => {
  mockRouter.isReady = true;
  mockNetwork = { currentNetwork: { chainId: "gnoland-1" }, isCustomNetwork: false };
  mockAccount = { isFetched: false };
});

it("does not expose account details before address classification completes", () => {
  expect(renderToStaticMarkup(<Page />)).not.toContain("Account details");
});

it("keeps account details hidden while a named realm is being redirected", () => {
  mockAccount = {
    isFetched: true,
    data: { data: { address, name: "named-realm", label: "gno.land/r/demo/foo", labelType: "realm" } },
  };
  expect(renderToStaticMarkup(<Page />)).not.toContain("Account details");
});

it("renders a regular account after classification", () => {
  mockAccount = { isFetched: true, data: { data: { address } } };
  expect(renderToStaticMarkup(<Page />)).toContain("Account details");
});

it("falls through to existing account error handling after a failed lookup", () => {
  mockAccount = { isFetched: true };
  expect(renderToStaticMarkup(<Page />)).toContain("Account details");
});

it("does not wait for backend classification on a custom network", () => {
  mockNetwork.isCustomNetwork = true;
  expect(renderToStaticMarkup(<Page />)).toContain("Account details");
});

it("waits for network initialization before using account query state", () => {
  mockNetwork.currentNetwork = null;
  mockAccount = { isFetched: true, data: { data: { address } } };
  expect(renderToStaticMarkup(<Page />)).not.toContain("Account details");
});

it("waits for the router before rendering a custom-network account", () => {
  mockRouter.isReady = false;
  mockNetwork.isCustomNetwork = true;
  expect(renderToStaticMarkup(<Page />)).not.toContain("Account details");
});
