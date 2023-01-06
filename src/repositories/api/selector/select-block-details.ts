import {numberWithCommas} from '@/common/utils';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import BigNumber from 'bignumber.js';

export const blockDetailSelector = (data: any) => {
  const gasPercent = Number.isNaN(data.gas.used / data.gas.wanted)
    ? 0
    : BigNumber((data.gas.used * 100) / data.gas.wanted).toFixed(2);
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
