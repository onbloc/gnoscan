import {numberWithCommas} from '@/common/utils';

export const tokenDetailSelector = (data: any) => {
  if (Object.keys(data).length === 0) {
    return {
      name: '',
      symbol: '',
      totalSupply: '',
      decimals: '',
      tokenPath: '',
      funcs: [],
      owner: '',
      address: '',
      holders: '0',
      log: {
        list: [],
        content: '',
      },
    };
  }
  return {
    name: data.name,
    symbol: data.symbol,
    totalSupply: numberWithCommas(data.total_supply),
    decimals: data.decimals,
    tokenPath: data.token_path,
    funcs: data.funcs,
    owner: Boolean(data.owner_name) ? data.owner_name : data.owner_address,
    address: data.owner_adress,
    holders: numberWithCommas(data.holders),
    log: {
      list: data.contract_list,
      content: data.contract_content,
    },
  };
};
