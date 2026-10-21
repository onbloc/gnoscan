import { NetworkClient } from "@/common/clients/network-client";
import { CommonError } from "@/common/errors";
import { ApiRepository } from "./api-repository";

class TestRepository extends ApiRepository {
  request<T>(url: string, params?: Parameters<ApiRepository["get"]>[1]) {
    return this.get<T>(url, params);
  }
}

function createClient(data: unknown) {
  const get = jest.fn().mockResolvedValue({ status: 200, message: "OK", data });
  return { client: { get } as unknown as NetworkClient, get };
}

describe("ApiRepository.get", () => {
  it("appends query parameters and unwraps the response data", async () => {
    const { client, get } = createClient({ data: { id: 1 } });
    const repository = new TestRepository(client);

    await expect(repository.request("/blocks", { cursor: "abc", limit: 20, empty: undefined })).resolves.toEqual({
      id: 1,
    });
    expect(get).toHaveBeenCalledWith({ url: "/blocks?cursor=abc&limit=20" });
  });

  it("keeps the url as is without query parameters", async () => {
    const { client, get } = createClient({ data: "value" });

    await new TestRepository(client).request("blocks/1");
    expect(get).toHaveBeenCalledWith({ url: "blocks/1" });
  });

  it("does not append a query string for empty parameters", async () => {
    const { client, get } = createClient({ data: "value" });

    await new TestRepository(client).request("/blocks", {});
    expect(get).toHaveBeenCalledWith({ url: "/blocks" });
  });

  it("resolves undefined when the response has no data", async () => {
    const { client } = createClient(undefined);

    await expect(new TestRepository(client).request("/blocks")).resolves.toBeUndefined();
  });

  it("throws synchronously when the network client is missing", () => {
    const repository = new TestRepository(null);

    expect(() => repository.request("/blocks")).toThrow(CommonError);
    expect(() => repository.request("/blocks")).toThrow(
      new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient").message,
    );
  });
});
