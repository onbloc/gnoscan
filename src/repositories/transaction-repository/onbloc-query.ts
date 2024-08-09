import {gql} from '@apollo/client';

export const TRANSACTIONS_QUERY = gql`
  {
    transactions(filter: {}) {
      edges {
        transaction {
          hash
          index
          success
          block_height
          gas_fee {
            amount
          }
          messages {
            value {
              __typename
              ... on BankMsgSend {
                from_address
                to_address
                amount
              }
              ... on MsgCall {
                caller
                send
                func
                pkg_path
              }
              ... on MsgAddPackage {
                creator
                package {
                  path
                }
              }
              ... on MsgRun {
                caller
                send
                package {
                  path
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const makeTransactionsQuery = (cursor: string | null) => gql`
  {
    transactions(
      filter: {}
      size: 20
      after: ${cursor ? `"${cursor}"` : 'null'}
      ascending: false
    ) {
      pageInfo {
        last
        hasNext
      }
      edges {
        transaction {
          hash
          index
          success
          block_height
          gas_fee {
            amount
          }
          messages {
            value {
              __typename
              ... on BankMsgSend {
                from_address
                to_address
                amount
              }
              ... on MsgCall {
                caller
                send
                func
                pkg_path
              }
              ... on MsgAddPackage {
                creator
                package {
                  path
                }
              }
              ... on MsgRun {
                caller
                send
                package {
                  path
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const makeTransactionHashQuery = (hash: string) => gql`
  {
    transactions(filter: {hash: "${hash}"}) {
      edges {
        transaction {
          hash
          block_height
        }
      }
    }
  }
`;

export const makeGRC20ReceivedTransactionsByAddressQuery = (address: string) => gql`
{
  transactions(filter: {
    message: {
      type_url: exec
      vm_param: {
        exec: {
          func: "Transfer"
          args: ["${address}"]
        }
      }
    }
  }) {
    edges {
      transaction {
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
    }
  }
}
`;

export const makeSimpleTransactionsByFromHeight = (height: number) => gql`
{
  transactions(filter: {
    from_block_height: ${height}
  }) {
    edges {
      transaction {
        success
        block_height
        messages {
          value {
            ...on BankMsgSend {
              from_address
            }
            ...on MsgCall {
              caller
              pkg_path
              func
              args
            }
            ...on MsgAddPackage {
              creator
            }
            ...on MsgRun {
              caller
            }
          }
        }
        gas_fee {
          amount
          denom
        }
        gas_used
        gas_wanted
      }
    }
  }
}
`;
