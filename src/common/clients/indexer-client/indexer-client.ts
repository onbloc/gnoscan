import {ApolloClient, DocumentNode, InMemoryCache} from '@apollo/client';
import {PageOption} from './types';
import axios, {AxiosInstance} from 'axios';

export class IndexerClient {
  public apolloClient: ApolloClient<unknown>;
  private axiosClient: AxiosInstance;

  constructor(url: string) {
    this.apolloClient = new ApolloClient({
      uri: url,
      cache: new InMemoryCache(),
    });
    this.axiosClient = axios.create({
      baseURL: url,
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

    return this.axiosClient
      .post('', {
        query: qry.loc?.source.body,
      })
      .then(result => result?.data);
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
