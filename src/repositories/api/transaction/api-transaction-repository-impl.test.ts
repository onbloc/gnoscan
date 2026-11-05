import { NetworkClient } from "@/common/clients/network-client";
import { ApiTransactionRepositoryImpl } from "./api-transaction-repository-impl";

const get = jest.fn().mockResolvedValue({ data: { data: {} } });
const repository = new ApiTransactionRepositoryImpl({ get } as unknown as NetworkClient);

beforeEach(() => get.mockClear());

describe("ApiTransactionRepositoryImpl", () => {
  it("encodes the function filter of the transaction list", async () => {
    await repository.getTransactions({ page: 2, functionKeyword: "a&b=c d" });
    expect(get).toHaveBeenCalledWith({ url: "transactions?page=2&functionKeyword=a%26b%3Dc%20d" });

    get.mockClear();
    await repository.getTransactions({ function: "Transfer" });
    expect(get).toHaveBeenCalledWith({ url: "transactions?function=Transfer" });
  });

  it("sends no function filter when none is given", async () => {
    await repository.getTransactions({ page: 1 });
    expect(get).toHaveBeenCalledWith({ url: "transactions?page=1" });
  });

  it("encodes the keyword of the function name suggestions", async () => {
    await repository.getTransactionFunctionNames({ keyword: "a&b" });
    expect(get).toHaveBeenCalledWith({ url: "transactions/functions?keyword=a%26b" });
  });
});
