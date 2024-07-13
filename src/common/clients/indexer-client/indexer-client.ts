import {ApolloClient, DocumentNode, InMemoryCache} from '@apollo/client';
import {PageOption} from './types';

export class IndexerClient {
  public apolloClient: ApolloClient<unknown>;

  constructor(url: string) {
    this.apolloClient = new ApolloClient({
      uri: url,
      cache: new InMemoryCache(),
    });
  }

  public query(qry: DocumentNode, pageOption?: PageOption) {
    if (pageOption) {
      return this.apolloClient.query({
        query: qry,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            'X-PAGE': pageOption.page,
            'X-PAGE-SIZE': pageOption.pageSize,
          },
        },
      });
    }

    return this.apolloClient.query({
      query: qry,
      fetchPolicy: 'no-cache',
    });
  }

  public queryWithOptions(qry: DocumentNode, pageOption: PageOption) {
    return this.apolloClient.query({
      query: qry,
      fetchPolicy: 'no-cache',
      variables: {
        'X-PAGE': pageOption.page,
        'X-PAGE-SIZE': pageOption.pageSize,
      },
      context: {
        headers: {
          'X-PAGE': pageOption.page,
          'X-PAGE-SIZE': pageOption.pageSize,
        },
      },
    });
  }
}
