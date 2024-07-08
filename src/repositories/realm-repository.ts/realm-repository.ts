import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {
  AddPackageValue,
  GRC20Info,
  IRealmRepository,
  MsgCallValue,
  RealmFunction,
  RealmTransaction,
  RealmTransactionInfo,
} from './types';
import {gql} from '@apollo/client';
import {NodeRPCClient} from '@/common/clients/node-client';
import {parseABCI} from '@gnolang/tm2-js-client';
import {toBech32AddressByPackagePath} from '@/common/utils/bech32.utility';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {Amount} from '@/types/data-type';
import {isAddPackageMessageValue} from './mapper';
import {GRC20_FUNCTIONS, parseGRC20InfoByFile} from '@/common/utils/realm.utility';
import {message} from 'antd';
import {GNOTToken} from '@/common/hooks/common/use-token-meta';
import {TransactionWithEvent} from '../response/transaction.types';

export class RealmRepository implements IRealmRepository {
  constructor(
    private nodeClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

  async getRealms(): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.query(gql`
      {
        transactions(filter: {success: true, message: {type_url: add_package}}) {
          hash
          index
          success
          block_height
          messages {
            value {
              __typename
              ... on MsgAddPackage {
                creator
                package {
                  name
                  path
                }
              }
            }
          }
        }
      }
    `);
  }

  async getRealm(realmPath: string): Promise<RealmTransaction | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .query(
        gql`
{
  transactions(filter: {
    success: true
    message: {
      route: vm
      type_url: add_package
      vm_param: {
				add_package: {
          package: {
            path: "${realmPath}"
          }
        }
      }
    }
  }) {
    hash
    index
    success
    block_height
    gas_wanted
    gas_used
    gas_fee {
      amount
      denom
    }
    messages {
      value {
        __typename
        ...on MsgAddPackage {
          creator
          deposit
          package {
            name
            path
            files {
              name
              body
            }
          }
        }
      }
    }
  }
}`,
      )
      .then(result => {
        if (!result?.data?.transactions || result?.data?.transactions.length === 0) {
          return null;
        }
        return result?.data?.transactions[0];
      });
  }

  async getRealmBalance(realmPath: string): Promise<Amount | null> {
    if (!this.nodeClient) {
      return null;
    }

    const realmAddress = toBech32AddressByPackagePath('g', realmPath);
    return this.nodeClient
      .abciQueryBankBalances(realmAddress)
      .then(response => response?.response?.ResponseBase?.Data)
      .then(encodedData => (encodedData ? parseABCI<string>(encodedData) : null))
      .then(data =>
        data
          ? ({
              value: parseTokenAmount(data).toString(),
              denom: GNOTToken.denom,
            } as Amount)
          : null,
      )
      .catch(() => null);
  }

  async getRealmFunctions(realmPath: string): Promise<RealmFunction[] | null> {
    if (!this.nodeClient) {
      return null;
    }

    const response = await this.nodeClient.abciQueryVMQueryFuncs(realmPath).catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const results = parseABCI<any[]>(response?.response?.ResponseBase?.Data);
      return results.map<RealmFunction>(result => ({
        functionName: result?.FuncName,
        params:
          result?.Params?.map((p: any) => ({
            name: p.Name,
            type: p.Type,
            value: p.Value,
          })) || [],
        results:
          result?.Results?.map((r: any) => ({
            name: r.Name,
            type: r.Type,
            value: r.Value,
          })) || [],
      }));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getRealmTransactions(realmPath: string): Promise<TransactionWithEvent[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .query(
        gql`
{
  transactions(filter: {
    message: {
      vm_param: {
				add_package: {
          package: {
            path: "${realmPath}"
          }
        }
        exec: {
          pkg_path: "${realmPath}"
        }
      }
    }
  }) {
    hash
    index
    success
    block_height
    gas_wanted
    response {
      events {
        __typename
        ...on GnoEvent {
          type
          pkg_path
          func
          attrs {
            key
            value
          }
        }
      }
    }
    gas_used
    gas_fee {
      amount
      denom
    }
    messages {
      value {
        __typename
        ...on MsgAddPackage {
          creator
          deposit
          package {
            name
            path
          }
        }
        ...on  MsgCall{
          caller
          send
          pkg_path
          func
        }
      }
    }
  }
}`,
      )
      .then(result => result?.data?.transactions || []);
  }

  async getRealmTransactionsWithArgs(realmPath: string): Promise<RealmTransaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .query(
        gql`
{
  transactions(filter: {
    message: {
      vm_param: {
				add_package: {
          package: {
            path: "${realmPath}"
          }
        }
        exec: {
          pkg_path: "${realmPath}"
        }
      }
    }
  }) {
    hash
    index
    success
    block_height
    gas_wanted
    gas_used
    gas_fee {
      amount
      denom
    }
    messages {
      value {
        __typename
        ...on MsgAddPackage {
          creator
          deposit
          package {
            name
            path
          }
        }
        ...on  MsgCall{
          caller
          send
          pkg_path
          func
          args
        }
      }
    }
  }
}`,
      )
      .then(result => result?.data?.transactions || []);
  }

  async getRealmTransactionInfos(): Promise<{[key in string]: RealmTransactionInfo} | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions: RealmTransaction[] | null = await this.indexerClient
      .query(
        gql`
          {
            transactions(filter: {message: {route: vm}}) {
              hash
              index
              success
              gas_used
              messages {
                value {
                  __typename
                  ... on MsgAddPackage {
                    creator
                    deposit
                    package {
                      name
                      path
                    }
                  }
                  ... on MsgCall {
                    caller
                    send
                    pkg_path
                    func
                  }
                }
              }
            }
          }
        `,
      )
      .then(result => result?.data?.transactions || [])
      .catch(() => null);
    if (!transactions) {
      return null;
    }

    return transactions.reduce<{[key in string]: RealmTransactionInfo}>(
      (accum: {[key in string]: RealmTransactionInfo}, current: RealmTransaction) => {
        let packagePath: string | null = null;
        let msgCallCount = 0;
        let gasUsed = current.gas_used;

        for (const message of current.messages) {
          if (isAddPackageMessageValue(message.value)) {
            packagePath = message.value.package?.path || null;
          } else if (message.value.__typename === 'MsgCall') {
            packagePath = message.value.pkg_path || null;
            msgCallCount += 1;
          }

          if (packagePath) {
            if (accum[packagePath]) {
              msgCallCount += accum[packagePath].msgCallCount;
              gasUsed += accum[packagePath].gasUsed;
            }

            accum[packagePath] = {
              msgCallCount,
              gasUsed,
            };
          }
        }

        return accum;
      },
      {},
    );
  }

  async getTokens(): Promise<GRC20Info[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions = await this.indexerClient
      .query(
        gql`
          {
            transactions(filter: {success: true, message: {type_url: add_package}}) {
              hash
              index
              success
              block_height
              messages {
                value {
                  __typename
                  ... on MsgAddPackage {
                    creator
                    package {
                      name
                      path
                      files {
                        name
                        body
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      )
      .then(result => result?.data?.transactions || [])
      .then((transactions: RealmTransaction<AddPackageValue>[]) => transactions);
    return transactions
      .flatMap(tx => tx.messages)
      .map(message => {
        for (const file of message.value.package?.files || []) {
          const info = parseGRC20InfoByFile(file.body);
          if (info) {
            return {
              ...info,
              packagePath: message.value.package?.path || '',
            };
          }
        }
        return null;
      })
      .filter(info => !!info) as GRC20Info[];
  }

  async getToken(packagePath: string): Promise<{
    realmTransaction: RealmTransaction<AddPackageValue>;
    tokenInfo: GRC20Info;
  } | null> {
    if (!this.nodeClient || !this.indexerClient) {
      return null;
    }

    const transactions = await this.indexerClient
      .query(
        gql`
          {
            transactions(
              filter: {
                success: true
                message: {
                  type_url: add_package
                  vm_param: {add_package: {package: {path: "gno.land/r/demo/tong"}}}
                }
              }
            ) {
              hash
              index
              success
              block_height
              messages {
                value {
                  __typename
                  ... on MsgAddPackage {
                    creator
                    package {
                      name
                      path
                      files {
                        name
                        body
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      )
      .then(result => (result?.data?.transactions as RealmTransaction<AddPackageValue>[]) || null)
      .catch(() => null);
    if (!transactions || transactions?.length < 1) {
      return null;
    }

    const realmTransaction = transactions[0];
    const tokenInfo = realmTransaction.messages
      .map(message => {
        const files = message.value.package?.files;
        if (!files) {
          return null;
        }

        for (const file of files) {
          const tokenInfo = parseGRC20InfoByFile(file.body);
          const tokenPath = message.value.package?.path;
          if (tokenInfo && tokenPath === packagePath) {
            return {
              ...tokenInfo,
              packagePath,
            };
          }
        }

        return null;
      })
      .filter(info => !!info)[0];

    if (!tokenInfo) {
      return null;
    }

    return {
      realmTransaction,
      tokenInfo: {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        owner: tokenInfo.owner,
        holders: 0,
        functions: GRC20_FUNCTIONS,
        totalSupply: 0,
        packagePath,
      },
    };
  }

  async getUsernames(): Promise<{[key in string]: string}> {
    if (!this.indexerClient) {
      return {};
    }

    const transactions = await this.indexerClient
      .query(
        gql`
          {
            transactions(
              filter: {
                success: true
                message: {
                  type_url: add_package
                  vm_param: {add_package: {package: {path: "gno.land/r/demo/tong"}}}
                }
              }
            ) {
              hash
              index
              success
              block_height
              messages {
                value {
                  __typename
                  ... on MsgAddPackage {
                    creator
                    package {
                      name
                      path
                      files {
                        name
                        body
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      )
      .then(result => (result?.data?.transactions as RealmTransaction<MsgCallValue>[]) || null)
      .catch(() => null);

    if (!transactions) {
      return {};
    }

    return transactions
      .flatMap(tx => tx.messages)
      .reduce<{[key in string]: string}>((accum, current) => {
        if (current.value.caller && current.value.args) {
          accum[current.value.caller] = current.value.args?.[1] || current.value.caller;
        }
        return accum;
      }, {});
  }
}
