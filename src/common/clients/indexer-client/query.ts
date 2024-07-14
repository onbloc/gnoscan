import {gql} from '@apollo/client';

type Argument = {[key in string]: any};

const makeTransactionFilterQuery = (params: {
  from_block_height?: number;
  to_block_height?: number;
  message?: {
    type_url?: 'send' | 'exec' | 'add_package' | 'run';
    bank_param?: {
      send?: {
        from_address?: string;
        to_address?: string;
      };
    };
    vm_param?: {
      exec?: {
        pkg_path?: string;
        caller?: string;
        func?: string;
        args?: string[];
      };
      add_package?: {
        creator?: string;
      };
      run?: {
        caller?: string;
      };
    };
  };
  events?: {
    pkg_path?: string;
  };
}) => {
  const conditions: string[] = [];

  if (params.from_block_height) {
    conditions.push('from_block_height: ' + params.from_block_height);
    conditions.push('to_block_height: ' + params.to_block_height);
  }
  return `{
      from_block_height: 1
      to_block_height: 1
      message: {
        type_url: send
        route: vm
        bank_param: {
          send: {
            from_address: ""
            to_address: ""
          }
        }
        vm_param: {
          exec: {
            pkg_path: ""
            caller: ""
            func: ""
            args: [""]
          }
          add_package: {
            creator: ""
          }
          run: {
            caller: ""
          }
        }
      }
      events: {
        pkg_path: ""
      }
  }`;
};

export const makeQueryOfTransactionDetails = () => {};
