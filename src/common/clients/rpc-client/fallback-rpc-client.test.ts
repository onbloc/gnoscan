import { AxiosError } from "axios";
import { FallbackRPCClient } from "./fallback-rpc-client";
import { makeRPCRequest } from "./request";
import { RPCClient } from "./rpc-client";

const PRIMARY = "https://rpc.primary.com";
const FALLBACK = "https://rpc.fallback.com";

function makeStubClients() {
  const calls: string[] = [];
  const clients = new Map<string, jest.Mock>();

  const createClient = (endpoint: string): RPCClient => {
    const call = jest.fn().mockResolvedValue({ id: "1", jsonrpc: "2.0", result: endpoint });
    clients.set(endpoint, call);

    return {
      call: (...args) => {
        calls.push(endpoint);
        return call(...args);
      },
    };
  };

  return { calls, clients, createClient };
}

describe("FallbackRPCClient", () => {
  const request = makeRPCRequest({ method: "health" });

  it("should call the primary endpoint while it answers", async () => {
    const { calls, createClient } = makeStubClients();
    const client = new FallbackRPCClient(PRIMARY, FALLBACK, createClient);

    await expect(client.call(request)).resolves.toMatchObject({ result: PRIMARY });
    expect(calls).toEqual([PRIMARY]);
    expect(client.activeEndpoint).toBe(PRIMARY);
  });

  it("should retry the same request on the fallback endpoint after a transport failure", async () => {
    const { calls, clients, createClient } = makeStubClients();
    const client = new FallbackRPCClient(PRIMARY, FALLBACK, createClient);
    clients.get(PRIMARY)?.mockRejectedValue(new AxiosError("Network Error"));

    await expect(client.call(request)).resolves.toMatchObject({ result: FALLBACK });
    expect(calls).toEqual([PRIMARY, FALLBACK]);
    expect(clients.get(FALLBACK)).toHaveBeenCalledWith(request);
    expect(client.activeEndpoint).toBe(FALLBACK);
  });

  it("should stay on a single endpoint when no fallback is configured", async () => {
    const { calls, clients, createClient } = makeStubClients();
    const client = new FallbackRPCClient(PRIMARY, null, createClient);
    const error = new AxiosError("Network Error");
    clients.get(PRIMARY)?.mockRejectedValue(error);

    await expect(client.call(request)).rejects.toBe(error);
    expect(calls).toEqual([PRIMARY]);
  });
});
