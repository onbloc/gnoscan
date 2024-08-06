import {gql} from '@apollo/client';

export const makeRealmEdgeQuery = (packagePath: string) => gql`
{
  transactions(
    filter: {
      success: true
      message: {
        route: vm
        type_url: add_package
        vm_param: {
          add_package: {
            package: {
              path: "${packagePath}"
            }
          }
        }
      }
    }
    size: 1
  ) {
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
    }
  }
}`;

export const makeRealmEdgesQuery = () => gql`
  {
    transactions(filter: {success: true, message: {type_url: add_package}}) {
      edges {
        transaction {
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
    }
  }
`;

export const makeRealmsQuery = () => gql`
  {
    transactions(filter: {success: true, message: {type_url: add_package}}, ascending: false) {
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
`;

export const makeRealmQuery = (packagePath: string) => gql`
{
  transactions(filter: {
    success: true
    message: {
      route: vm
      type_url: add_package
      vm_param: {
				add_package: {
          package: {
            path: "${packagePath}"
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
}`;

export const makeRealmTransactionsQuery = () => gql`
  {
    transactions(filter: {message: {vm_param: {add_package: {}, exec: {}}}}) {
      hash
      index
      success
      block_height
      gas_wanted
      response {
        events {
          __typename
          ... on GnoEvent {
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
`;

export const makeRealmTransactionsWithArgsQuery = (packagePath: string) => gql`
{
  transactions(filter: {
    message: {
      vm_param: {
				add_package: {
          package: {
            path: "${packagePath}"
          }
        }
        exec: {
          pkg_path: "${packagePath}"
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
}`;

export const makeRealmCallTransactionsWithArgsQuery = (packagePath: string) => gql`
{
  transactions(filter: {
    success:true
    message: {
      type_url: exec
      vm_param: {
        exec: {
          pkg_path: "${packagePath}"
        }
      }
    }
  }) {
    success
    block_height
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
}`;

export const makeRealmTransactionInfosQuery = () => gql`
  {
    transactions(filter: {message: {route: vm}}) {
      hash
      index
      success
      gas_fee {
        amount
      }
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
`;

export const makeRealmTransactionInfoQuery = (packagePath: string) => gql`
{
  transactions(filter: {
    message: {
      route: vm
      vm_param: {
        add_package: {
          package: {
            path : "${packagePath}"
          }
        }
        run: {
          package: {
            path : "${packagePath}"
          }
        }
        exec: {
          pkg_path: "${packagePath}"
        }
      }
    }
  }
) {
    hash
    index
    success
    gas_fee {
      amount
    }
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
`;

export const makeRealmPackagesQuery = () => gql`
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
`;

export const makeTokensQuery = () => gql`
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
`;

export const makeTokenQuery = (packagePath: string) => gql`
{
  transactions(
    filter: {
      success: true
      message: {
        type_url: add_package
        vm_param: {add_package: {package: {path: "${packagePath}"}}}
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
`;

export const makeUsernameQuery = () => gql`
  {
    transactions(
      filter: {
        success: true
        message: {
          type_url: exec
          vm_param: {exec: {pkg_path: "gno.land/r/demo/users", func: "Register"}}
        }
      }
    ) {
      hash
      index
      success
      messages {
        value {
          __typename
          ... on MsgCall {
            args
            caller
          }
        }
      }
    }
  }
`;
