/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RPCResponse<T = string> {
  id: string;
  jsonrpc: string;
  result?: T;
  error?: any;
}
