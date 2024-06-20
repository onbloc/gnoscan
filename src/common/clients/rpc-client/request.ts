import {v1} from 'uuid';

export interface RPCRequest {
  id: string;
  jsonrpc: string;
  method: string;
  params: string[];
}

export function makeRPCRequest({
  id,
  method,
  params,
}: {
  id?: string;
  method: string;
  params?: string[];
}): RPCRequest {
  return {
    id: id || v1().toString(),
    jsonrpc: '2.0',
    method: method,
    params: params || [],
  };
}
