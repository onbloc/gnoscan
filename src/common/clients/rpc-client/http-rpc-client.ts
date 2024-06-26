import {RPCClient} from './rpc-client';
import {RPCRequest} from './request';
import {RPCResponse} from './response';
import axios, {AxiosInstance} from 'axios';

export class HttpRPCClient implements RPCClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  call<T>(request: RPCRequest): Promise<RPCResponse<T>> {
    return this.client.post<RPCResponse<T>>('', request).then(data => data.data);
  }
}
