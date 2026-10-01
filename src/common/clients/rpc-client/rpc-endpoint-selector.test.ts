import { AxiosError } from "axios";
import { RPCEndpointSelector, isTransportError } from "./rpc-endpoint-selector";

const PRIMARY = "https://rpc.primary.com";
const FALLBACK = "https://rpc.fallback.com";

function makeAxiosError(status?: number): AxiosError {
  const error = new AxiosError("request failed");
  if (status !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.response = { status } as any;
  }
  return error;
}

describe("isTransportError", () => {
  it("should treat an axios error without a response as a transport error", () => {
    expect(isTransportError(makeAxiosError())).toBe(true);
  });

  it("should treat 5xx and 429 responses as transport errors", () => {
    expect(isTransportError(makeAxiosError(500))).toBe(true);
    expect(isTransportError(makeAxiosError(502))).toBe(true);
    expect(isTransportError(makeAxiosError(429))).toBe(true);
  });

  it("should not treat other 4xx responses as transport errors", () => {
    expect(isTransportError(makeAxiosError(400))).toBe(false);
    expect(isTransportError(makeAxiosError(404))).toBe(false);
  });

  it("should recognize transport failures reported as plain messages", () => {
    expect(isTransportError(new Error("connect ECONNREFUSED 127.0.0.1:26657"))).toBe(true);
    expect(isTransportError(new Error("timeout of 5000ms exceeded"))).toBe(true);
    expect(isTransportError(new Error("Failed to fetch"))).toBe(true);
  });

  it("should not recognize node-level errors as transport failures", () => {
    expect(isTransportError(new Error("error"))).toBe(false);
    expect(isTransportError(new Error("invalid response returned"))).toBe(false);
    expect(isTransportError(undefined)).toBe(false);
  });
});

describe("RPCEndpointSelector", () => {
  it("should only hold the primary endpoint when no fallback is configured", () => {
    const selector = new RPCEndpointSelector(PRIMARY);

    expect(selector.endpoints).toEqual([PRIMARY]);
    expect(selector.active).toBe(PRIMARY);
  });

  it("should ignore a fallback that duplicates the primary endpoint", () => {
    const selector = new RPCEndpointSelector(PRIMARY, PRIMARY);

    expect(selector.endpoints).toEqual([PRIMARY]);
  });

  it("should run the request on the primary endpoint when it answers", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn().mockResolvedValue("ok");

    await expect(selector.run(request)).resolves.toBe("ok");
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(PRIMARY);
    expect(selector.active).toBe(PRIMARY);
  });

  it("should retry on the fallback endpoint after a transport failure", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn().mockRejectedValueOnce(makeAxiosError()).mockResolvedValueOnce("ok");

    await expect(selector.run(request)).resolves.toBe("ok");
    expect(request.mock.calls).toEqual([[PRIMARY], [FALLBACK]]);
  });

  it("should keep using the fallback endpoint for later requests", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn().mockRejectedValueOnce(makeAxiosError(502)).mockResolvedValue("ok");

    await selector.run(request);
    request.mockClear();

    await expect(selector.run(request)).resolves.toBe("ok");
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(FALLBACK);
    expect(selector.active).toBe(FALLBACK);
  });

  it("should rotate back to the primary endpoint when the fallback fails", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const request = jest.fn().mockRejectedValueOnce(makeAxiosError()).mockResolvedValue("ok");

    await selector.run(request);
    expect(selector.active).toBe(FALLBACK);

    request.mockClear();
    request.mockRejectedValueOnce(makeAxiosError()).mockResolvedValue("ok");

    await expect(selector.run(request)).resolves.toBe("ok");
    expect(request.mock.calls).toEqual([[FALLBACK], [PRIMARY]]);
    expect(selector.active).toBe(PRIMARY);
  });

  it("should try every endpoint at most once and rethrow the last transport error", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const lastError = makeAxiosError(503);
    const request = jest.fn().mockRejectedValueOnce(makeAxiosError()).mockRejectedValueOnce(lastError);

    await expect(selector.run(request)).rejects.toBe(lastError);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("should rethrow a node-level error without rotating", async () => {
    const selector = new RPCEndpointSelector(PRIMARY, FALLBACK);
    const nodeError = makeAxiosError(400);
    const request = jest.fn().mockRejectedValue(nodeError);

    await expect(selector.run(request)).rejects.toBe(nodeError);
    expect(request).toHaveBeenCalledTimes(1);
    expect(selector.active).toBe(PRIMARY);
  });
});
