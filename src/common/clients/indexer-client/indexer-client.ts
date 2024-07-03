import {ApolloClient, DocumentNode, InMemoryCache} from '@apollo/client';

export class IndexerClient {
  public apolloClient: ApolloClient<unknown>;

  constructor(url: string) {
    this.apolloClient = new ApolloClient({
      uri: url,
      cache: new InMemoryCache(),
    });
  }

  public query(qry: DocumentNode) {
    return this.apolloClient.query({
      query: qry,
      fetchPolicy: 'no-cache',
    });
  }
}
