import BigNumber from 'bignumber.js';

const DEFAULT_ASSET = {
  type: 'native',
  denom: 'gnot',
  value: 0,
  name: 'Gnot',
};

export const realmDetailSelector = (data: any) => {
  return {
    name: data.name,
    funcs: data.list_funcs,
    address: data.address || '',
    publisherName: Boolean(data.publisher_username) ? data.publisher_username : data.publisher,
    publisherAddress: data.publisher,
    blockPublished: data.height,
    path: data.path,
    ContractCalls: data.total_calls,
    assets: (data.assets || [DEFAULT_ASSET]).map((asset: any) => ({
      type: asset?.type || '',
      denom: `${asset?.denom || ''}`.toUpperCase(),
      value: BigNumber(asset?.value || 0).toString(),
      name: asset?.name || '',
    })),
    totalUsedFee: {
      value: BigNumber(data.total_used_fees?.value || '0'),
      denom: `${data.total_used_fees?.denom ?? ''}`.toUpperCase(),
    },
    log: {
      list: data.extra.files,
      content: data.extra.contents.map((v: any) => window.atob(v)),
    },
  };
};
