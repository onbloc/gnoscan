import {makeHexByBase64} from '@/common/utils/transaction.utility';
import {RPCClient, RPCResponse, makeRPCRequest} from '../rpc-client';
import {HttpRPCClient} from '../rpc-client/http-rpc-client';
import {WsRPCClient} from '../rpc-client/ws-rpc-client';
import {
  NodeClient,
  NodeResponseABCIInfo,
  NodeResponseABCIQuery,
  NodeResponseBlock,
  NodeResponseBlockResults,
  NodeResponseBlockchainInfo,
  NodeResponseGenesis,
  NodeResponseStatus,
  NodeResponseTx,
  NodeResponseValidators,
} from './types';
import {
  makeRPCUrl,
  prepareVMABCIEvaluateExpressionQuery,
  prepareVMABCIQuery,
  prepareVMABCIQueryWithSeparator,
  prepareVMABCIRenderQuery,
} from './utility';

function handleResponse<T>(response: RPCResponse<T>): T {
  if (!response.result) {
    console.log(response.error);
    throw new Error('error');
  }
  return response.result;
}

export class NodeRPCClient implements NodeClient {
  private rpcClient: RPCClient;
  private chainId: string;

  constructor(rpcUrl: string, chainId?: string) {
    const currentRPCUrl = makeRPCUrl(rpcUrl);
    this.rpcClient = new WsRPCClient(currentRPCUrl.wsUrl);
    // this.rpcClient = new HttpRPCClient(currentRPCUrl.httpUrl);
    this.chainId = chainId || '';
  }

  public get isLegacy() {
    return this.chainId === 'test3';
  }

  health(): Promise<boolean> {
    const request = makeRPCRequest({
      method: 'health',
      params: [],
    });

    return this.rpcClient.call(request).then(response => response.result !== undefined);
  }

  status(): Promise<NodeResponseStatus> {
    const request = makeRPCRequest({
      method: 'status',
      params: [],
    });

    return this.rpcClient.call<NodeResponseStatus>(request).then(handleResponse);
  }

  genesis(): Promise<NodeResponseGenesis> {
    const request = makeRPCRequest({
      method: 'genesis',
      params: [],
    });

    return this.rpcClient.call<NodeResponseGenesis>(request).then(handleResponse);
  }

  block(height: number): Promise<NodeResponseBlock> {
    const request = makeRPCRequest({
      method: 'block',
      params: [height.toString()],
    });

    return this.rpcClient.call<NodeResponseBlock>(request).then(handleResponse);
  }

  blockResults(height: number): Promise<NodeResponseBlockResults> {
    const request = makeRPCRequest({
      method: 'block_results',
      params: [height.toString()],
    });

    return this.rpcClient.call<NodeResponseBlockResults>(request).then(handleResponse);
  }

  blockchain(minHeight: number, maxHeight: number): Promise<NodeResponseBlockchainInfo> {
    const request = makeRPCRequest({
      method: 'blockchain',
      params: [minHeight.toString(), maxHeight.toString()],
    });

    return this.rpcClient.call<NodeResponseBlockchainInfo>(request).then(handleResponse);
  }

  validators(height: number): Promise<NodeResponseValidators> {
    const request = makeRPCRequest({
      method: 'validators',
      params: [height.toString()],
    });

    return this.rpcClient.call<NodeResponseValidators>(request).then(handleResponse);
  }

  tx(hash: string): Promise<NodeResponseTx> {
    const hexValue = makeHexByBase64(hash);
    const request = makeRPCRequest({
      method: 'tx',
      params: [hexValue],
    });

    return this.rpcClient.call<NodeResponseTx>(request).then(handleResponse);
  }

  abciInfo(): Promise<NodeResponseABCIInfo> {
    const request = makeRPCRequest({
      method: 'abci_info',
      params: [],
    });

    return this.rpcClient.call<NodeResponseABCIInfo>(request).then(handleResponse);
  }
  abciQuery(path: string, data = ''): Promise<NodeResponseABCIQuery> {
    const request = makeRPCRequest({
      method: 'abci_query',
      params: [path, data],
    });

    return this.rpcClient.call<NodeResponseABCIQuery>(request).then(handleResponse);
  }
  abciQueryAuthAccount(address: string): Promise<NodeResponseABCIQuery> {
    const path = 'auth/accounts/' + address;

    return this.abciQuery(path);
  }
  abciQueryBankBalances(address: string): Promise<NodeResponseABCIQuery> {
    const path = 'bank/balances/' + address;

    return this.abciQuery(path);
  }

  abciQueryVMQueryFuncs(packagePath: string): Promise<NodeResponseABCIQuery> {
    const path = 'vm/qfuncs';

    const request = makeRPCRequest({
      method: 'abci_query',
      params: [path, prepareVMABCIQuery([packagePath])],
    });

    return this.rpcClient.call<NodeResponseABCIQuery>(request).then(handleResponse);
  }

  abciQueryVMQueryFile(packagePath: string): Promise<NodeResponseABCIQuery> {
    const path = 'vm/qfile';

    const request = makeRPCRequest({
      method: 'abci_query',
      params: [path, prepareVMABCIQuery([packagePath])],
    });

    return this.rpcClient.call<NodeResponseABCIQuery>(request).then(handleResponse);
  }

  abciQueryVMQueryRender(packagePath: string, data: string[]): Promise<NodeResponseABCIQuery> {
    const path = 'vm/qrender';
    const paramQueryString = this.isLegacy
      ? prepareVMABCIQueryWithSeparator([packagePath, ...data], '\n')
      : prepareVMABCIEvaluateExpressionQuery([packagePath, ...data]);

    const request = makeRPCRequest({
      method: 'abci_query',
      params: [path, paramQueryString],
    });

    return this.rpcClient.call<NodeResponseABCIQuery>(request).then(handleResponse);
  }

  abciQueryVMQueryEvaluation(
    packagePath: string,
    funcName: string,
    args: string[],
  ): Promise<NodeResponseABCIQuery> {
    const path = 'vm/qeval';
    const paramArgs = args.map(arg => `"${arg}"`).join(',');
    const paramQuery = `${funcName}(${paramArgs})`;
    const paramQueryString = this.isLegacy
      ? prepareVMABCIQueryWithSeparator([packagePath, paramQuery], '\n')
      : prepareVMABCIEvaluateExpressionQuery([packagePath, paramQuery]);

    const request = makeRPCRequest({
      method: 'abci_query',
      params: [path, paramQueryString],
    });

    return this.rpcClient.call<NodeResponseABCIQuery>(request).then(handleResponse);
  }
}
