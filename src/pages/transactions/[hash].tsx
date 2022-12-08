import React from 'react';
import styled from 'styled-components';
import {useQuery, UseQueryResult} from 'react-query';
import {useRouter} from 'next/router';
import {isDesktop} from '@/common/hooks/use-media';
import {numberWithCommas, StatusResultType, statusObj} from '@/common/utils';
import {getDateDiff} from '@/common/utils/date-util';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import {PaletteKeyType} from '@/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import Text from '@/components/ui/text';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {v1} from 'uuid';
import mixins from '@/styles/mixins';
import useLoading from '@/common/hooks/use-loading';
import LoadingPage from '@/components/view/loading/page';

type SummaryType = {
  statusType: StatusResultType;
  statusColor: PaletteKeyType;
  timestamp: string;
  dateDiff: string;
  hash: string;
  network: string;
  block: number;
  txFee: string;
  gas: string;
  memo: string;
};

interface TxResultType {
  summary: SummaryType;
  contract: any;
  log: string;
}

type ContractKeyType =
  | 'GetBoardIDFromName'
  | 'CreateBoard'
  | 'CreateThread'
  | 'CreateReply'
  | 'CreateRepost'
  | 'DeletePost'
  | 'EditPost'
  | 'RenderBoard'
  | 'Render'
  | 'Register';

type KeyOfContract = {
  type: string;
  data: {[T in string]: any};
};

const contractObj = {
  GetBoardIDFromName: ['Name'],
  CreateBoard: ['Name'],
  CreateThread: ['Board ID', 'Title', 'Body'],
  CreateReply: ['Board ID', 'Thread Id', 'Post Id', 'Body'],
  CreateRepost: ['Board ID', 'Post Id', 'Title', 'Body', 'Destination Board ID'],
  DeletePost: ['Board ID', 'Thread Id', 'Post Id', 'Reason'],
  EditPost: ['Board ID', 'Thread Id', 'Post Id', 'Title', 'Body'],
  RenderBoard: ['Board ID'],
  Render: ['Path'],
  Register: ['Inviter', 'Name', 'Profile'],
  AddPkg: ['Creator', 'Name', 'Path'],
  Transfer: ['From', 'To', 'Amount'],
} as const;

const ellipsisTextKey = ['Caller', 'Body'];

const valueForContractType = (contract: any) => {
  let map: KeyOfContract = {
    type: '',
    data: {},
  };
  const {type, func} = contract;

  if (type === '/vm.m_addpkg' && func === 'AddPkg') {
    map = {
      type: func,
      data: {
        Creator: contract.username ? contract.username : contract.creator,
        Name: contract.pkg_name,
        Path: contract.pkg_path,
      },
    };
  } else if (type === '/bank.MsgSend' && func === 'Transfer') {
    map = {
      type: func,
      data: {
        From: contract.from_address,
        To: contract.to_address,
        Amount: {
          denom: contract.amount.denom,
          value:
            contract.amount.denom === 'ugnot'
              ? contract.amount.value / 1000000
              : contract.amount.value,
        },
      },
    };
  } else if (type === '/vm.m_call') {
    if (contract.pkg_path === '/r/demo/boards') {
      return contractObj[type as ContractKeyType].forEach((v: string, i: number) => {
        map.type = contract.func;
        map.data[v] = contract.args[i];
      });
    } else if (contract.pkg_path === '/r/demo/users') {
      map = {
        type: func,
        data: {
          Register: contract.args,
        },
      };
    } else {
      map = {
        type: func,
        data: {
          Caller: contract.username ? contract.username : contract.caller,
        },
      };
    }
  } else {
    map = {
      type: func,
      data: {
        Caller: contract.username ? contract.username : contract.caller,
      },
    };
  }
  return map;
};

const TransactionDetails = () => {
  const {loading} = useLoading();
  const desktop = isDesktop();
  const router = useRouter();
  const {hash} = router.query;
  const {
    data: tx,
    isSuccess: txSuccess,
    isFetched,
  }: UseQueryResult<TxResultType> = useQuery(
    ['tx/hash', hash],
    async ({queryKey}) => await axios.get(`http://3.218.133.250:7677/latest/tx/${queryKey[1]}`),
    {
      enabled: !!hash,
      select: (res: any) => {
        const {summary, contract, log} = res.data;
        const gasPercent = Number.isNaN(summary.gas.used / summary.gas.wanted)
          ? 0
          : summary.gas.used / summary.gas.wanted;

        const summaryData: SummaryType = {
          ...summary,
          statusType: statusObj(summary.status),
          timestamp: `${dayjs(summary.timestamp).format('YYYY-MM-DD HH:mm:ss')} (UTC)`,
          dateDiff: getDateDiff(summary.timestamp),
          hash: summary.hash,
          network: summary.network,
          block: summary.block,
          txFee: summary.fee.denom === 'ugnot' ? summary.fee.value / 1000000 : summary.fee.value,
          gas: `${numberWithCommas(summary.gas.used)}/${numberWithCommas(
            summary.gas.wanted,
          )} (${gasPercent}%)`,
          memo: summary.memo || '-',
        };

        const contractData = {
          ...contract,
          args: valueForContractType(contract),
        };

        return {
          ...res.data,
          summary: summaryData,
          contract: contractData,
          log: log,
        };
      },
      // onSuccess: (res: any) => console.log('Tx hash Data : ', res),
    },
  );

  return (
    <DetailsPageLayout title={'Transaction Details'} isFetched={isFetched}>
      {txSuccess && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Success</dt>
              <dd>
                <Badge type={tx.summary.statusType.color}>
                  <Text type="p4" color="white">
                    {tx.summary.statusType.status}
                  </Text>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Timestamp</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {tx.summary.timestamp}
                  </Text>
                  <DateDiffText>{tx.summary.dateDiff}</DateDiffText>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Tx Hash</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {tx.summary.hash}
                  </Text>
                  <Tooltip content="Copied!" trigger="click" copyText={tx.summary.hash}>
                    <StyledIconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Network</dt>
              <dd>
                <Badge>{tx.summary.network}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Block</dt>
              <dd>
                <Badge>
                  <Link href={`/blocks/${tx.summary.block}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {tx.summary.block}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Transaction Fee</dt>
              <dd>
                <Badge>
                  <AmountText minSize="body2" maxSize="p4" value={tx.summary.txFee} denom="GNOT" />
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Gas (Used/Wanted)</dt>
              <dd>
                <Badge>{tx.summary.gas}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Memo</dt>
              <dd>
                <Badge>{tx.summary.memo}</Badge>
              </dd>
            </DLWrap>
          </DataSection>
          <DataSection title="Contract">
            <DLWrap desktop={desktop}>
              <dt>Type</dt>
              <dd>
                <Badge type="blue">
                  <Text type="p4" color="white">
                    {tx.contract.args.type}
                  </Text>
                </Badge>
              </dd>
            </DLWrap>
            {tx.contract.args.type === 'Transfer' ? (
              <TransferContract contract={tx.contract} desktop={desktop} />
            ) : (
              Object.keys(tx.contract.args.data).map((v, i) => (
                <DLWrap desktop={desktop} key={v1()}>
                  <dt>{v}</dt>
                  <dd>
                    <Badge>
                      <Text
                        type="p4"
                        color="inherit"
                        className={ellipsisTextKey.includes(v) ? 'ellipsis' : ''}>
                        {tx.contract.args.data[v] ?? '-'}
                      </Text>
                    </Badge>
                  </dd>
                </DLWrap>
              ))
            )}
            {tx.log && <ShowLog isTabLog={false} logData={tx.log} btnTextType="Logs" />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

const TransferContract = ({contract, desktop}: any) => {
  return (
    <>
      <DLWrap desktop={desktop}>
        <dt>Amount</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              value={contract.args.data.Amount['value']}
              denom="GNOT"
            />
          </Badge>
        </dd>
      </DLWrap>
      {['From', 'To'].map((v, i) => (
        <DLWrap desktop={desktop} key={v1()}>
          <dt>{v}</dt>
          <dd>
            <Badge>
              <AddressTextBox>
                <Text type="p4" color="blue" className="ellipsis">
                  <Link href={`/accounts/${contract.args.data[v]}`} passHref>
                    <FitContentA>{contract.args.data[v]}</FitContentA>
                  </Link>
                  {contract.from_username && v === 'From' && (
                    <Text type="p4" color="primary" display="inline-block">
                      {` (${contract.from_username})`}
                    </Text>
                  )}
                  {contract.to_username && v === 'To' && (
                    <Text type="p4" color="primary" display="inline-block">
                      {` (${contract.to_username})`}
                    </Text>
                  )}
                </Text>
                <Tooltip
                  content="Copied!"
                  trigger="click"
                  copyText={contract.args.data[v]}
                  className="address-tooltip">
                  <StyledIconCopy />
                </Tooltip>
              </AddressTextBox>
            </Badge>
          </dd>
        </DLWrap>
      ))}
    </>
  );
};

const AddressTextBox = styled.div`
  ${mixins.flexbox('row', 'center', 'center')}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;

const StyledIconCopy = styled(IconCopy)`
  stroke: ${({theme}) => theme.colors.primary};
  margin-left: 6px;
`;

export default TransactionDetails;
