import {gql} from '@apollo/client';

export const makeRealmQuery = (packagePath: string) => gql`
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

export const makeRealmsQuery = () => gql`
  {
    transactions(
      filter: {success: true, message: {type_url: add_package}}
      ascending: false
      size: 10000
    ) {
      edges {
        transaction {
          hash
          index
          success
          block_height
          messages {
            value {
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

export const makeLatestRealmsQuery = () => gql`
  {
    transactions(
      filter: {success: true, message: {type_url: add_package}}
      ascending: false
      size: 10
    ) {
      edges {
        transaction {
          hash
          index
          success
          block_height
          messages {
            value {
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

export const makeRealmTransactionsQuery = (packagePath: string) => gql`
  {
    transactions(
      filter: {
        message: {
          vm_param: {
            add_package: {
              package: {
                path: "${packagePath}"
              }
            }, 
            exec: {
              pkg_path: "${packagePath}"
            }
          }
        }
      }, 
    ascending: false
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
          response {
            events {
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
          messages {
            value {
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
    }
  }
`;

export const makeRealmTransactionsByEventQuery = (
  packagePath: string,
  cursor: string | null,
) => gql`
  {
    transactions(
      filter: {
        events: [
          {
            pkg_path: "${packagePath}"
          }
        ]
      }, 
      after: ${cursor ? `"${cursor}"` : 'null'},
      size: 20
      ascending: false
  ) {
      pageInfo {
        hasNext
        last
      }
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
    edges {
      transaction {
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
    }
  }
}`;

export const makeRealmTransactionInfosQuery = (fromHeight?: number) => gql`
  {
    transactions(
      filter: {
        message: {route: vm}
        ${fromHeight ? `from_block_height: ${fromHeight}` : ''}
      }
    ) {
      edges {
        transaction {
          hash
          index
          success
          gas_fee {
            amount
          }
          gas_used
          messages {
            value {
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
    edges {
      transaction {
        hash
        index
        success
        gas_fee {
          amount
        }
        gas_used
        messages {
          value {
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
  }
}
`;

export const makeRealmPackagesQuery = (cursor: string | null) => gql`
  {
    transactions(
      filter: {success: true, message: {type_url: add_package}}
      after: ${cursor ? `"${cursor}"` : 'null'}
      size: 20
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
          messages {
            value {
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
    }
  }
`;

export const makeTokensQuery = () => gql`
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
    size: 1
  ) {
    edges {
      transaction {
        hash
        index
        success
        block_height
        messages {
          value {
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
      edges {
        transaction {
          hash
          index
          success
          messages {
            value {
              ... on MsgCall {
                args
                caller
              }
            }
          }
        }
      }
    }
  }
`;
