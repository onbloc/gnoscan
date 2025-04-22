import { gql } from "@apollo/client";

export const makeTransactionsQuery = (fromBlockHeight: number) => gql`
  {
    transactions(filter: {
      from_block_height: ${fromBlockHeight}
    }) {
      hash
      index
      success
      block_height
      gas_fee {
        amount
      }
      messages {
        value {
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

export const makeGRC20ReceivedEvents = (address: string) => gql`
  {
    transactions(
      filter: {
        success: true
        events: [
          {
            type: "Transfer"
            attrs: [{key: "to", value: "${address}"}]
          }
        ]
        message: {type_url: exec}
      }
    ) {
      response {
        events {
          ... on GnoEvent {
            type
            pkg_path
            func
          }
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
        ...on MsgCall {
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
`;

export const makeNativeTokenSendTransactionsByAddressQuery = (address: string) => gql`
{
  transactions(filter: {
    message: {
      type_url: send
      bank_param: {
        send: {
          from_address: "${address}"
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
        ...on BankMsgSend{
          from_address
          to_address
          amount
        }
      }
    }
  }
}
`;

export const makeNativeTokenReceivedTransactionsByAddressQuery = (address: string) => gql`
{
  transactions(filter: {
    message: {
      type_url: send
      bank_param: {
        send: {
          to_address: "${address}"
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
        ...on BankMsgSend{
          from_address
          to_address
          amount
        }
      }
    }
  }
}
`;

export const makeVMTransactionsByAddressQuery = (address: string) => gql`
{
  transactions(filter: {
    message: {
      route: vm
      vm_param: {
        exec: {
          caller: "${address}"
        }
        add_package: {
          creator: "${address}"
        }
        run: {
          caller: "${address}"
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
            args
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
