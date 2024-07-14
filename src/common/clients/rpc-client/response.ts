export interface RPCResponse<T = string> {
  id: string;
  jsonrpc: string;
  result?: T;
  error?: any;
}
