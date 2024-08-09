import {ApolloClient, DocumentNode, InMemoryCache} from '@apollo/client';
import {PageOption, PageQueryResponse, QueryResponse} from './types';
import axios, {AxiosInstance} from 'axios';
import {GraphQLFormattedError} from 'graphql';

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

  public query<T = any>(qry: DocumentNode, pageOption?: PageOption) {
    if (pageOption) {
      return this.apolloClient.query<QueryResponse<T>>({
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
      .then<{data?: QueryResponse<T>; errors?: GraphQLFormattedError[]}>(result => result?.data);
  }

  public pageQuery<T = any>(qry: DocumentNode) {
    return this.apolloClient.query<PageQueryResponse<T>>({
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
