import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import BigNumber from 'bignumber.js';

export const blockDetailSelector = (data: any) => {
  console.log('11111 ', data);
  const bigNumPlus = BigNumber(data.gas.used).multipliedBy(100);
  const gasPercent = Number.isNaN(data.gas.used / data.gas.wanted)
    ? 0
    : numberWithFixedCommas(bigNumPlus.dividedBy(data.gas.wanted), 2);
  return {
    ...data,
    timestamp: getLocalDateString(data.time),
    dateDiff: getDateDiff(data.time),
    network: data.network,
    height: data.height,
    txs: data.num_txs,
    gas: `${numberWithCommas(data.gas.used)}/${numberWithCommas(data.gas.wanted)} (${gasPercent}%)`,
    proposer: Boolean(data.proposer_username) ? data.proposer_username : data.proposer,
    address: data.proposer,
    prev: data.height === 1,
    next: !data.next,
  };
};
