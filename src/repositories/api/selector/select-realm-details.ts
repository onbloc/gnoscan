import BigNumber from 'bignumber.js';

export const realmDetailSelector = (data: any) => {
  return {
    name: data.name,
    funcs: data.list_funcs,
    publisher: Boolean(data.publisher_username) ? data.publisher_username : data.publisher,
    address: data.publisher,
    blockPublished: data.height,
    path: data.path,
    ContractCalls: data.total_calls,
    gasUsed: BigNumber(data.gas_used),
    log: {
      list: data.extra.files,
      content: data.extra.contents.map((v: any) => window.atob(v)),
    },
  };
};
