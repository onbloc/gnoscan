import axios from "axios";

const TRANSPORT_MESSAGE_PATTERN =
  /failed to fetch|network\s?error|load failed|request aborted|ECONNREFUSED|ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|timeout|socket hang up/i;

function isServerSideStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

/**
 * Whether a rejected RPC call means "this endpoint is not answering" rather
 * than "the node answered, and the answer was an error". Only the former may
 * trigger a fallback, since the fallback would reproduce the latter anyway.
 */
export function isTransportError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (axios.isAxiosError(error)) {
    return !error.response || isServerSideStatus(error.response.status);
  }

  const message = error instanceof Error ? error.message : String(error);

  return TRANSPORT_MESSAGE_PATTERN.test(message);
}

/**
 * A network's RPC endpoints used as a ring: the configured `rpcUrl`, then the
 * optional `fallbackRpcUrl`.
 *
 * Requests start on `rpcUrl`. A transport failure rotates to the next endpoint
 * and retries there, and the rotation sticks, so the retry and every later
 * request use `fallbackRpcUrl` instead of paying the dead endpoint's timeout
 * again. A transport failure on `fallbackRpcUrl` rotates back to `rpcUrl` the
 * same way. Each `run` tries every endpoint at most once before giving up.
 */
export class RPCEndpointSelector {
  private readonly rpcEndpoints: string[];

  private activeIndex = 0;

  constructor(rpcUrl: string, fallbackRpcUrl?: string | null) {
    this.rpcEndpoints = fallbackRpcUrl && fallbackRpcUrl !== rpcUrl ? [rpcUrl, fallbackRpcUrl] : [rpcUrl];
  }

  public get endpoints(): string[] {
    return [...this.rpcEndpoints];
  }

  public get active(): string {
    return this.rpcEndpoints[this.activeIndex];
  }

  public async run<T>(request: (endpoint: string) => Promise<T>): Promise<T> {
    let lastTransportError: unknown;

    for (let attempt = 0; attempt < this.rpcEndpoints.length; attempt++) {
      const attemptedIndex = this.activeIndex;

      try {
        return await request(this.rpcEndpoints[attemptedIndex]);
      } catch (error) {
        if (!isTransportError(error)) {
          throw error;
        }

        lastTransportError = error;
        this.rotateFrom(attemptedIndex);
      }
    }

    throw lastTransportError;
  }

  private rotateFrom(attemptedIndex: number): void {
    // A concurrent request may already have rotated away from the endpoint this
    // call tried; leave its choice alone rather than rotating twice.
    if (this.activeIndex !== attemptedIndex) {
      return;
    }

    this.activeIndex = (attemptedIndex + 1) % this.rpcEndpoints.length;
  }
}
