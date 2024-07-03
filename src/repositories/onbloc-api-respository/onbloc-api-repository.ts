import {RPCClient} from '@/common/clients/rpc-client';
import {IOnblocAPIRepository, OnblocAPIResultGRC20Token, OnblocAPIResultUsername} from './types';

export class OnblocAPIRepository implements IOnblocAPIRepository {
  constructor(private rpcClient: RPCClient) {}

  getGRC20Tokens(): Promise<OnblocAPIResultGRC20Token[]> {
    throw new Error('Method not implemented.');
  }

  getUsernames(): Promise<Record<string, OnblocAPIResultUsername>> {
    throw new Error('Method not implemented.');
  }
}
