import { IAccountRepository } from "@/repositories/account-repository";
import { fetchIndexerTransactions } from "./queries";

jest.mock("@/common/hooks/provider/use-network-provider", () => ({ useNetworkProvider: jest.fn() }));
jest.mock("@/common/hooks/provider/use-service-provider", () => ({ useServiceProvider: jest.fn() }));

const page = (last: string | null, hasNext: boolean) => ({ transactions: [], pageInfo: { last, hasNext } });

function repositoryWith(getAccountTransactions: jest.Mock) {
  return { getAccountTransactions } as unknown as IAccountRepository;
}

describe("fetchIndexerTransactions", () => {
  it("follows the cursor until the last page", async () => {
    const getAccountTransactions = jest
      .fn()
      .mockResolvedValueOnce(page("c1", true))
      .mockResolvedValueOnce(page("c2", false));

    await fetchIndexerTransactions(repositoryWith(getAccountTransactions), "g1");

    expect(getAccountTransactions.mock.calls).toEqual([
      ["g1", null],
      ["g1", "c1"],
    ]);
  });

  it.each([null, "c1"])("stops when the cursor %s does not advance", async last => {
    const getAccountTransactions = jest
      .fn()
      .mockResolvedValueOnce(page("c1", true))
      .mockResolvedValue(page(last, true));

    await fetchIndexerTransactions(repositoryWith(getAccountTransactions), "g1");

    expect(getAccountTransactions).toHaveBeenCalledTimes(2);
  });
});
