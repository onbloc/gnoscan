import {BigNumber} from 'bignumber.js';
import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {AccountCardModel, BlockCardModel, SupplyCardModel, TxsCardModel} from '@/models';

export const supplyCardSelector = (data: any): SupplyCardModel => {
  return {
    supply: numberWithCommas(data.supply),
    exit: numberWithCommas(data.exit),
    airdrop_holders: numberWithCommas(data.airdrop_holders),
  };
};

export const blockCardSelector = (data: any): BlockCardModel => {
  return {
    height: numberWithCommas(data.height),
    avg_tx: numberWithFixedCommas(data.avg_tx, 2),
    avg_time: numberWithFixedCommas(data.avg_time, 2),
  };
};

export const txsCardSelector = (data: any): TxsCardModel => {
  return {
    avg_24hr: numberWithFixedCommas(BigNumber(data.avg_24hr / 1000000), 6),
    total_fee: numberWithFixedCommas(BigNumber(data.total_fee / 1000000), 2),
    total_txs: numberWithCommas(data.total_txs),
  };
};

export const accountCardSelector = (data: any): AccountCardModel => {
  console.log('$ ', data);
  return {
    totalAccounts: numberWithCommas(data.total_accounts),
    totalUsers: numberWithCommas(data.total_users),
    validators: numberWithCommas(data.validators),
  };
};
