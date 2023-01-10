import {numberWithCommas, numberWithFixedCommas, statusObj} from '@/common/utils';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import {
  ContractKeyType,
  contractObj,
  KeyOfContract,
  SummaryDataType,
} from '@/models/transaction-details-model';
import BigNumber from 'bignumber.js';

const valueForContractType = (contract: any) => {
  let map: KeyOfContract = {
    type: '',
    data: {},
  };
  const {type, pkg_func} = contract;
  if (type === '/vm.m_addpkg' && pkg_func === 'AddPkg') {
    map = {
      type: pkg_func,
      data: {
        Creator: contract.creator_username ? contract.creator_username : contract.creator_address,
        Name: contract.pkg_name,
        Path: contract.pkg_path,
      },
    };
  } else if (type === '/bank.MsgSend' && pkg_func === 'Transfer') {
    map = {
      type: pkg_func,
      data: {
        From: contract.from_address,
        To: contract.to_address,
        Amount: {
          denom: contract.amount.denom,
          value: contract.amount.value,
        },
      },
    };
  } else if (type === '/vm.m_call') {
    if (contract.pkg_path === 'gno.land/r/demo/boards') {
      contractObj[pkg_func as ContractKeyType].forEach((v: string, i: number) => {
        map.type = contract.pkg_func;
        map.data[v] = contract.args[i];
      });
    } else if (contract.pkg_path === 'gno.land/r/demo/users') {
      contractObj[pkg_func as ContractKeyType].forEach((v: string, i: number) => {
        map.type = contract.pkg_func;
        map.data[v] = contract.args[i];
      });
    } else {
      map = {
        type: pkg_func,
        data: {
          Caller: contract.caller_username ? contract.caller_username : contract.caller_address,
        },
      };
    }
  }
  return map;
};

export const transactionDetailSelector = (data: any) => {
  const {summary, contract, log} = data;
  console.log(';;;;;; ', data);
  const bigNumUsed = BigNumber(summary.gas.used);
  const bigNumWanted = BigNumber(summary.gas.wanted);
  const bigNumMultiplied = bigNumUsed.multipliedBy(100);
  const isNaNCheck = Number.isNaN(bigNumUsed.dividedBy(bigNumWanted));
  const gasPercent = isNaNCheck
    ? 0
    : numberWithFixedCommas(bigNumMultiplied.dividedBy(bigNumWanted), 2);
  const summaryData: SummaryDataType = {
    ...summary,
    statusType: statusObj(summary.status),
    timestamp: getLocalDateString(summary.time),
    dateDiff: getDateDiff(summary.time),
    hash: summary.hash,
    network: summary.network,
    height: summary.height,
    txFee: summary.fee.value,
    gas: `${numberWithCommas(summary.gas.used)}/${numberWithCommas(
      summary.gas.wanted,
    )} (${gasPercent}%)`,
    memo: summary.memo || '-',
  };

  const contractData = {
    ...contract,
    contract_list: contract.contract_list.map((v: any) => ({
      ...v,
      args: valueForContractType(v),
    })),
  };
  return {
    ...data,
    summary: summaryData,
    contract: contractData,
    log: log,
  };
};
