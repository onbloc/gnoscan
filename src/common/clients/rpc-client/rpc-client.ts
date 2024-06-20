import {RPCRequest} from './request';
import {RPCResponse} from './response';

export interface RPCClient {
  call<T>(path: string, request: RPCRequest): Promise<RPCResponse<T>>;
}
