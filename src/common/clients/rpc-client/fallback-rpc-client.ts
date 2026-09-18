import { HttpRPCClient } from "./http-rpc-client";
import { RPCRequest } from "./request";
import { RPCClient } from "./rpc-client";
import { RPCEndpointSelector } from "./rpc-endpoint-selector";
import { RPCResponse } from "./response";

type RPCClientFactory = (endpoint: string) => RPCClient;

const createHttpRPCClient: RPCClientFactory = endpoint => new HttpRPCClient(endpoint);

/**
 * An `RPCClient` that keeps one client per endpoint and routes every call
 * through an {@link RPCEndpointSelector}, so a request that fails at the
 * transport level is retried on the fallback endpoint.
 */
export class FallbackRPCClient implements RPCClient {
  private readonly clients: Map<string, RPCClient>;
  private readonly selector: RPCEndpointSelector;

  constructor(rpcUrl: string, fallbackRpcUrl?: string | null, createClient: RPCClientFactory = createHttpRPCClient) {
    this.selector = new RPCEndpointSelector(rpcUrl, fallbackRpcUrl);
    this.clients = new Map(this.selector.endpoints.map(endpoint => [endpoint, createClient(endpoint)]));
  }

  public get activeEndpoint(): string {
    return this.selector.active;
  }

  call<T>(request: RPCRequest): Promise<RPCResponse<T>> {
    return this.selector.run(endpoint => {
      const client = this.clients.get(endpoint);
      if (!client) {
        throw new Error(`RPC client is not initialized: ${endpoint}`);
      }

      return client.call<T>(request);
    });
  }
}
