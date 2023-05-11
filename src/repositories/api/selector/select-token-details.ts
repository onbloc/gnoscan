import {numberWithCommas} from '@/common/utils';

export const tokenDetailSelector = (data: any) => {
  if (Object.keys(data).length === 0) {
    return {
      name: '',
      symbol: '',
      totalSupply: '',
      decimals: '',
      pkgPath: '',
      funcs: [],
      owner: '',
      address: '',
      holders: '0',
      log: {
        list: [],
        content: [],
      },
    };
  }

  return {
    name: data.name,
    symbol: data.symbol,
    totalSupply: numberWithCommas(data.total_supply),
    decimals: data.decimals,
    pkgPath: data.pkg_path,
    funcs: data.functions,
    owner: Boolean(data.publisher_username) ? data.publisher_username : data.publisher,
    address: data.publisher,
    holders: numberWithCommas(data.holders_count),
    log: {
      list: data.extra.files,
      content: data.extra.contents,
    },
  };
};
