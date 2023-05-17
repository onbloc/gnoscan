import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useQuery, UseQueryResult} from 'react-query';
import {useRouter} from 'next/router';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import Text from '@/components/ui/text';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {v1} from 'uuid';
import mixins from '@/styles/mixins';
import {TransactionDetailsModel} from '@/models/transaction-details-model';
import {getTransactionDetails} from '@/repositories/api/fetchers/api-transaction-details';
import {transactionDetailSelector} from '@/repositories/api/selector/select-transaction-details';

const ellipsisTextKey = ['Caller', 'Body'];

const TransactionDetails = () => {
  const desktop = isDesktop();
  const router = useRouter();
  const {hash} = router.query;
  const {
    data: tx,
    isSuccess: txSuccess,
    isFetched,
  }: UseQueryResult<TransactionDetailsModel> = useQuery(
    ['tx/hash', hash],
    async () => await getTransactionDetails(hash),
    {
      enabled: !!hash,
      retry: 0,
      select: (res: any) => transactionDetailSelector(res.data),
    },
  );
  return (
    <DetailsPageLayout
      title={'Transaction Details'}
      visible={!isFetched}
      keyword={`${hash}`}
      error={!txSuccess}>
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
                  <Link href={`/blocks/${tx.summary.height}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {tx.summary.height}
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
                  <AmountText
                    minSize="body2"
                    maxSize="p4"
                    value={tx.summary.txFee}
                    denom={tx.summary.denom.toUpperCase()}
                  />
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
            {tx.contract.contract_list.map((v: any, i: number) => (
              <ContractListBox key={v1()}>
                {tx.contract.num_msgs > 1 && (
                  <Text type="h6" color="tertiary" margin="0px 0px 12px">{`#${i + 1}`}</Text>
                )}
                <DLWrap desktop={desktop}>
                  <dt>Type</dt>
                  <dd>
                    <Badge type="blue">
                      <Text type="p4" color="white">
                        {v.args.type}
                      </Text>
                    </Badge>
                  </dd>
                </DLWrap>
                {v.type === '/vm.m_call' && v.args.type === 'Transfer' && (
                  <TransferContract contract={v} desktop={desktop} />
                )}
                {v.type === '/bank.MsgSend' && v.args.type === 'Transfer' && (
                  <TransferContract contract={v} desktop={desktop} />
                )}
                {v.args.type === 'AddPkg' && <AddPkgContract contract={v} desktop={desktop} />}
                {!['Transfer', 'AddPkg'].includes(v.args.type) && (
                  <CallerContract contract={v} desktop={desktop} />
                )}
              </ContractListBox>
            ))}
            {tx.log && <ShowLog isTabLog={false} logData={tx.log} btnTextType="Logs" />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

const CallerContract = ({contract, desktop}: any) => {
  return (
    <>
      {Object.keys(contract.args.data).map((v, i) =>
        v === 'Caller' ? (
          <DLWrap desktop={desktop} key={v1()}>
            <dt>{v}</dt>
            <dd>
              <Badge>
                <Link href={`/accounts/${contract.caller_address || '-'}`} passHref>
                  <FitContentA>
                    <Text
                      type="p4"
                      color="blue"
                      className={ellipsisTextKey.includes(v) ? 'ellipsis' : ''}>
                      {contract.args.data[v] ? (
                        <Tooltip content={contract.caller_address}>{contract.args.data[v]}</Tooltip>
                      ) : (
                        '-'
                      )}
                    </Text>
                  </FitContentA>
                </Link>
              </Badge>
            </dd>
          </DLWrap>
        ) : (
          <DLWrap desktop={desktop} key={v1()}>
            <dt>{v}</dt>
            <dd>
              <Badge>
                <Text
                  type="p4"
                  color="inherit"
                  className={ellipsisTextKey.includes(v) ? 'ellipsis' : ''}>
                  {contract.args.data[v] || '-'}
                </Text>
              </Badge>
            </dd>
          </DLWrap>
        ),
      )}
    </>
  );
};

const AddPkgContract = ({contract, desktop}: any) => {
  return (
    <>
      {Object.keys(contract.args.data).map(v => (
        <DLWrap desktop={desktop} key={v1()}>
          <dt>{v}</dt>
          <dd>
            <Badge>
              {v === 'Creator' ? (
                <Link href={`/accounts/${contract.creator_address}`} passHref>
                  <FitContentA>
                    <Text type="p4" color="blue">
                      {contract.args.data[v] || '-'}
                    </Text>
                  </FitContentA>
                </Link>
              ) : v === 'Path' ? (
                <Link href={`/realms/details?path=${contract.pkg_path}`} passHref>
                  <FitContentA>
                    <Text type="p4" color="blue">
                      {contract.args.data[v] || '-'}
                    </Text>
                  </FitContentA>
                </Link>
              ) : (
                <Text
                  type="p4"
                  color={'inherit'}
                  className={ellipsisTextKey.includes(v) ? 'ellipsis' : ''}>
                  {contract.args.data[v] || '-'}
                </Text>
              )}
            </Badge>
          </dd>
        </DLWrap>
      ))}
    </>
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
              value={contract.args.data.Amount ? contract.args.data.Amount['value'] : 0}
              denom={contract.amount ? contract.amount.denom.toUpperCase() : ''}
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
                {contract.args.data[v] ? (
                  <>
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
                  </>
                ) : (
                  <Text type="p4">-</Text>
                )}
              </AddressTextBox>
            </Badge>
          </dd>
        </DLWrap>
      ))}
    </>
  );
};

const ContractListBox = styled.div`
  width: 100%;
  margin-top: 16px;
  & + & {
    margin-top: 32px;
  }
`;

const AddressTextBox = styled.div`
  ${mixins.flexbox('row', 'center', 'center')}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;

const StyledIconCopy = styled(IconCopy)`
  stroke: ${({theme}) => theme.colors.primary};
  margin-left: 10px;
`;

export default TransactionDetails;
