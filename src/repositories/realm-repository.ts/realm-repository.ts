import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {IRealmRepository} from './types';
import {gql} from '@apollo/client';

export class RealmRepository implements IRealmRepository {
  constructor(private indexerClient: IndexerClient | null) {}

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

  async getRealm(realmPath: string): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.query(gql`
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
    messages {
      value {
        __typename
        ...on MsgAddPackage {
          creator
          package {
            name
            path
          }
        }
      }
    }
  }
}`);
  }

  getTokens(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getToken(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
