import {RPCRequest} from './request';
import {RPCResponse} from './response';

export interface RPCClient {
  call<T>(request: RPCRequest): Promise<RPCResponse<T>>;
}
