import { IndexerClient } from "@/common/clients/indexer-client/indexer-client";
import { OnblocAccountRepository } from "./onbloc-account-repository";

jest.mock("@gnolang/tm2-js-client", () => ({ parseABCI: jest.fn() }));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({ useNetworkProvider: jest.fn() }));

const ADDRESS = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";

function repositoryWith(pageQuery: jest.Mock) {
  return new OnblocAccountRepository(null, { pageQuery } as unknown as IndexerClient);
}

function frozenResponse(pageInfo?: { last: string | null; hasNext: boolean }, edges: unknown[] = []) {
  return Object.freeze({
    data: Object.freeze({ transactions: Object.freeze({ edges, pageInfo: pageInfo && Object.freeze(pageInfo) }) }),
  });
}

describe("OnblocAccountRepository.getAccountTransactions", () => {
  it("returns the page info from the indexer so callers can request the next page", async () => {
    const repository = repositoryWith(jest.fn().mockResolvedValue(frozenResponse({ last: "c1", hasNext: true })));

    const result = await repository.getAccountTransactions(ADDRESS, null);

    expect(result.pageInfo).toEqual({ last: "c1", hasNext: true });
  });

  it("falls back to an empty page info when the indexer omits it", async () => {
    const repository = repositoryWith(jest.fn().mockResolvedValue(frozenResponse()));

    const result = await repository.getAccountTransactions(ADDRESS, null);

    expect(result.pageInfo).toEqual({ last: null, hasNext: false });
  });

  it("returns an empty result when the indexer request fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const repository = repositoryWith(jest.fn().mockRejectedValue(new Error("down")));

    const result = await repository.getAccountTransactions(ADDRESS, null);

    expect(result).toEqual({ transactions: [], pageInfo: { last: null, hasNext: false } });
  });

  it("stops paging when a page fails to map", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const malformedEdge = { transaction: { messages: [] } };
    const repository = repositoryWith(
      jest.fn().mockResolvedValue(frozenResponse({ last: "c1", hasNext: true }, [malformedEdge])),
    );

    const result = await repository.getAccountTransactions(ADDRESS, null);

    expect(result).toEqual({ transactions: [], pageInfo: { last: null, hasNext: false } });
  });
});
