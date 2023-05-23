import {BigNumber} from 'bignumber.js';
import {formatAddress, formatEllipsis} from '@/common/utils';
import {getLocalDateString} from '@/common/utils/date-util';

export const accountListSelector = (data: any) => {
  const accounts = data.accounts.map((v: any) => {
    return {
      no: v.idx,
      address: v.account,
      account: Boolean(v.account_username)
        ? formatEllipsis(v.account_username)
        : formatAddress(v.account),
      totalTxs: v.total_txs,
      nonTxs: v.non_transfer_txs,
      balance: BigNumber(v.balance.value),
    };
  });
  return {
    last_update: data.last_update,
    data: accounts,
  };
};

export const boardListSelector = (data: any) => {
  const boards = data.boards.map((v: any, i: number) => {
    return {
      no: v.idx,
      originName: v.board_name,
      formatName: formatEllipsis(v.board_name),
      hovertext: v.board_name,
      replies: v.replies,
      reposts: v.reposts,
      uniqueUsers: v.unique_users,
      boardLink: v.board_link,
    };
  });
  return {
    last_update: getLocalDateString(data.last_update),
    data: boards,
  };
};

export const newestListSelector = (data: any) => {
  const realms = data.realms.map((v: any) => {
    return {
      no: v.idx,
      originName: v.pkg_path,
      formatName: formatEllipsis(v.pkg_name),
      originPkgName: v.pkg_name,
      originAddress: v.publisher,
      publisher: Boolean(v.publisher_username)
        ? formatEllipsis(v.publisher_username)
        : formatAddress(v.publisher),
      functions: v.num_funcs,
      calls: v.calls,
      block: v.block,
    };
  });
  return {
    last_update: getLocalDateString(data.last_update),
    data: realms,
  };
};
