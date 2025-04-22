/* eslint-disable @typescript-eslint/no-explicit-any */
import WebSocket from "isomorphic-ws";
import { RPCClient } from "./rpc-client";
import { RPCRequest } from "./request";
import { RPCResponse } from "./response";

export class WsRPCClient implements RPCClient {
  private ws: WebSocket;
  protected readonly requestMap: Map<
    number | string,
    {
      resolve: (response: RPCResponse<any>) => void;
      reject: (reason: Error) => void;
      timeout: NodeJS.Timeout;
    }
  > = new Map(); // callback method map for the individual endpoints
  protected requestTimeout = 15000; // 15s

  constructor(connectUrl: string) {
    this.ws = new WebSocket(connectUrl);
    this.ws.addEventListener("message", event => {
      const response = JSON.parse(event.data as string) as RPCResponse<any>;
      const request = this.requestMap.get(response.id);
      if (request) {
        this.requestMap.delete(response.id);
        clearTimeout(request.timeout);

        request.resolve(response);
      }
    });
  }

  /**
   * Closes the WS connection. Required when done working
   * with the WS provider
   */
  closeConnection() {
    this.ws.close();
  }

  /**
   * Sends a request to the WS connection, and resolves
   * upon receiving the response
   * @param {RPCRequest} request the RPC request
   */
  async call<T>(request: RPCRequest): Promise<RPCResponse<T>> {
    // Make sure the connection is open
    if (this.ws.readyState != WebSocket.OPEN) {
      await this.waitForOpenConnection();
    }

    // The promise will resolve as soon as the response is received
    const promise = new Promise<RPCResponse<T>>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.requestMap.delete(request.id);

        reject(new Error("Request timed out"));
      }, this.requestTimeout);

      this.requestMap.set(request.id, { resolve, reject, timeout });
    });

    this.ws.send(JSON.stringify(request));

    return promise;
  }

  /**
   * Parses the result from the response
   * @param {RPCResponse<Result>} response the response to be parsed
   */
  parseResponse<Result>(response: RPCResponse<Result>): Result {
    if (!response) {
      throw new Error("invalid response");
    }

    if (response.error) {
      throw new Error(response.error?.message);
    }

    if (!response.result) {
      throw new Error("invalid response returned");
    }

    return response.result;
  }

  /**
   * Waits for the WS connection to be established
   */
  waitForOpenConnection = (): Promise<null> => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 20;
      const intervalTime = 500; // ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve(null);
        }

        currentAttempt++;
        if (currentAttempt >= maxNumberOfAttempts) {
          clearInterval(interval);
          reject(new Error("Unable to establish WS connection"));
        }
      }, intervalTime);
    });
  };
}
