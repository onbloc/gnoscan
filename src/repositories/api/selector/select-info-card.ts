import {BigNumber} from 'bignumber.js';
import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {AccountCardModel, BlockCardModel, SupplyCardModel, TxsCardModel} from '@/models';

export const supplyCardSelector = (data: any): SupplyCardModel => {
  return {
    supply: numberWithCommas(BigNumber(data.supply)),
    exit: numberWithCommas(BigNumber(data.exit)),
    airdrop_holders: numberWithCommas(BigNumber(data.airdrop_holders)),
  };
};

export const blockCardSelector = (data: any): BlockCardModel => {
  return {
    height: numberWithCommas(BigNumber(data.height)),
    avg_tx: numberWithFixedCommas(BigNumber(data.avg_tx), 2),
    avg_time: numberWithFixedCommas(BigNumber(data.avg_time), 2),
  };
};

export const txsCardSelector = (data: any): TxsCardModel => {
  return {
    avg_24hr: numberWithFixedCommas(BigNumber(data.avg_24hr), 6),
    total_fee: numberWithFixedCommas(BigNumber(data.total_fee), 2),
    total_txs: numberWithCommas(BigNumber(data.total_txs)),
  };
};

export const accountCardSelector = (data: any): AccountCardModel => {
  return {
    totalAccounts: numberWithCommas(BigNumber(data.total_accounts)),
    totalUsers: numberWithCommas(data.total_users),
    validators: numberWithCommas(data.validators),
  };
};
