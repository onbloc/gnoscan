import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useQuery } from "react-query";
import { useServiceProvider } from "../provider/use-service-provider";
import { useNetworkProvider } from "../provider/use-network-provider";
import { useGetUsername } from "./use-get-username";

jest.mock("react-query", () => ({ useQuery: jest.fn() }));
jest.mock("../provider/use-service-provider", () => ({ useServiceProvider: jest.fn() }));
jest.mock("../provider/use-network-provider", () => ({ useNetworkProvider: jest.fn() }));
jest.mock("../use-network", () => ({ useNetwork: () => ({ currentNetwork: { chainId: "gnoland1" } }) }));

const mockUseQuery = jest.mocked(useQuery);
const getUsernames = jest.fn(async () => ({ g1abc: "alice" }));

const runQueryFn = (isCustomNetwork: boolean) => {
  jest.mocked(useServiceProvider).mockReturnValue({ realmRepository: { getUsernames } } as never);
  jest.mocked(useNetworkProvider).mockReturnValue({ isCustomNetwork } as never);
  const Probe = () => {
    useGetUsername();
    return null;
  };
  renderToStaticMarkup(<Probe />);
  const options = mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1][0] as unknown as {
    queryFn: () => unknown;
  };
  return Promise.resolve(options.queryFn());
};

beforeEach(() => getUsernames.mockClear());

it("skips the legacy indexer username query on standard networks", async () => {
  await expect(runQueryFn(false)).resolves.toEqual({});
  expect(getUsernames).not.toHaveBeenCalled();
});

it("queries usernames on custom networks", async () => {
  await expect(runQueryFn(true)).resolves.toEqual({ g1abc: "alice" });
  expect(getUsernames).toHaveBeenCalledTimes(1);
});
