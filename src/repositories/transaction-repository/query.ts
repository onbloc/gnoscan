import {gql} from '@apollo/client';

export const TRANSACTIONS_QUERY = gql`
  {
    transactions(filter: {}) {
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
`;

export const makeTransactionHashQuery = (hash: string) => gql`
  {
    transactions(filter: {hash: "${hash}"}) {
      hash
      block_height
    }
  }
`;
