import { NetworkClient } from "@/common/clients/network-client";
import { ApiTransactionRepositoryImpl } from "./api-transaction-repository-impl";

const get = jest.fn().mockResolvedValue({ data: { data: {} } });
const repository = new ApiTransactionRepositoryImpl({ get } as unknown as NetworkClient);

beforeEach(() => get.mockClear());

describe("ApiTransactionRepositoryImpl", () => {
  it("sends one function parameter per label, encoded", async () => {
    await repository.getTransactions({ page: 2, function: ["Transfer", "a&b=c d"] });
    expect(get).toHaveBeenCalledWith({ url: "transactions?page=2&function=Transfer&function=a%26b%3Dc%20d" });

    get.mockClear();
    await repository.getTransactions({ function: ["Transfer"] });
    expect(get).toHaveBeenCalledWith({ url: "transactions?function=Transfer" });
  });

  it("sends the excluded labels as excludeFunction, after the kept ones", async () => {
    await repository.getTransactions({ function: ["Mint"], excludeFunction: ["Vote", "a b"] });
    expect(get).toHaveBeenCalledWith({ url: "transactions?function=Mint&excludeFunction=Vote&excludeFunction=a%20b" });
  });

  it("sends no function parameter without labels", async () => {
    await repository.getTransactions({ page: 1, function: [], excludeFunction: [] });
    expect(get).toHaveBeenCalledWith({ url: "transactions?page=1" });

    get.mockClear();
    await repository.getTransactions({});
    expect(get).toHaveBeenCalledWith({ url: "transactions" });
  });

  it("encodes the keyword of the function name suggestions", async () => {
    await repository.getTransactionFunctionNames({ keyword: "a&b" });
    expect(get).toHaveBeenCalledWith({ url: "transactions/functions?keyword=a%26b" });
  });
});
