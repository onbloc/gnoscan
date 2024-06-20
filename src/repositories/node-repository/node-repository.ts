import {RPCClient, makeRPCRequest} from '@/common/clients/rpc-client';
import {
  INodeRepository,
  NodeResultABCIInfo,
  NodeResultABCIQuery,
  NodeResultBlock,
  NodeResultBlockResults,
  NodeResultBlockchainInfo,
  NodeResultCommit,
  NodeResultConsensusParams,
  NodeResultConsensusState,
  NodeResultGenesis,
  NodeResultNetInfo,
  NodeResultStatus,
  NodeResultValidators,
} from './types';

export class NodeRepository implements INodeRepository {
  constructor(private rpcClient: RPCClient) {}

  health(): Promise<boolean> {
    const request = makeRPCRequest({
      method: 'health',
      params: [],
    });
    return this.rpcClient
      .call('', request)
      .then(result => !result.error)
      .catch(() => false);
  }

  status(): Promise<NodeResultStatus> {
    throw new Error('Method not implemented.');
  }
  netInfo(): Promise<NodeResultNetInfo> {
    throw new Error('Method not implemented.');
  }
  genesis(): Promise<NodeResultGenesis> {
    throw new Error('Method not implemented.');
  }
  consensusParams(height: number): Promise<NodeResultConsensusParams> {
    throw new Error('Method not implemented.');
  }
  consensusState(): Promise<NodeResultConsensusState> {
    throw new Error('Method not implemented.');
  }
  commit(height: number): Promise<NodeResultCommit> {
    throw new Error('Method not implemented.');
  }
  block(height: number): Promise<NodeResultBlock> {
    throw new Error('Method not implemented.');
  }
  blockResults(height: number): Promise<NodeResultBlockResults> {
    throw new Error('Method not implemented.');
  }
  blockchain(minHeight: number, maxHeight: number): Promise<NodeResultBlockchainInfo> {
    throw new Error('Method not implemented.');
  }
  validators(height: number): Promise<NodeResultValidators> {
    throw new Error('Method not implemented.');
  }
  abciInfo(): Promise<NodeResultABCIInfo> {
    throw new Error('Method not implemented.');
  }
  abciQuery(path: string, data: string): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryAuthAccount(address: string): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryBankBalances(address: string): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryVMQueryFuncs(packagePath: string): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryVMQueryFile(packagePath: string): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryVMQueryRender(packagePath: string, data: string[]): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
  abciQueryVMQueryEvaluation(
    packagePath: string,
    funcName: string,
    args: string[],
  ): Promise<NodeResultABCIQuery> {
    throw new Error('Method not implemented.');
  }
}
