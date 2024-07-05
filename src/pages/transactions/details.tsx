import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {useRouter} from '@/common/hooks/common/use-router';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import Text from '@/components/ui/text';
import Tooltip from '@/components/ui/tooltip';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {v1} from 'uuid';
import mixins from '@/styles/mixins';
import {useTransaction} from '@/common/hooks/transactions/use-transaction';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {makeDisplayTokenAmount} from '@/common/utils/string-util';

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

const ellipsisTextKey = ['Caller'];

function parseTxHash(url: string) {
  if (!url.includes('txhash=')) {
    return '';
  }
  const params = url.split('txhash=');
  if (params.length < 2) return '';

  const txHash = params[1].split('&')[0];
  return decodeURIComponent(txHash);
}

const TransactionDetails = () => {
  const desktop = isDesktop();
  const {asPath, push} = useRouter();
  const hash = parseTxHash(asPath);
  const {gas, network, timeStamp, transactionItem, isFetched} = useTransaction(hash);

  useEffect(() => {
    if (hash === '') {
      push('/transactions');
    }
  });

  return (
    <DetailsPageLayout
      title={'Transaction Details'}
      visible={!isFetched}
      keyword={`${hash}`}
      error={!transactionItem?.success}>
      {transactionItem?.success && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Success</dt>
              <dd>
                <Badge type={transactionItem?.success ? 'green' : 'failed'}>
                  <Text type="p4" color="white">
                    {transactionItem?.success ? 'Success' : 'Failure'}
                  </Text>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Timestamp</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {timeStamp.time}
                  </Text>
                  <DateDiffText>{timeStamp.passedTime}</DateDiffText>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Tx Hash</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {hash}
                  </Text>
                  <Tooltip content="Copied!" trigger="click" copyText={hash}>
                    <StyledIconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Network</dt>
              <dd>
                <Badge>{network}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Block</dt>
              <dd>
                <Badge>
                  <Link href={`/blocks/${transactionItem.blockHeight}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {transactionItem.blockHeight}
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
                    value={transactionItem.fee.value}
                    denom={transactionItem.fee.denom}
                  />
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Gas (Used/Wanted)</dt>
              <dd>
                <Badge>{gas}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Memo</dt>
              <dd>
                <Badge>{transactionItem.memo}</Badge>
              </dd>
            </DLWrap>
          </DataSection>
          <DataSection title="Contract">
            {transactionItem?.messages?.map((message: any, i: number) => (
              <ContractListBox key={v1()}>
                {transactionItem.numOfMessage > 1 && (
                  <Text type="h6" color="white" margin="0px 0px 12px">{`#${i + 1}`}</Text>
                )}
                {message['@type'] !== '/bank.MsgSend' && (
                  <>
                    <DLWrap desktop={desktop}>
                      <dt>Name</dt>
                      <dd>
                        <Badge>
                          <Text type="p4" color="white">
                            {message?.package?.name || message?.func || '-'}
                          </Text>
                        </Badge>
                      </dd>
                    </DLWrap>
                    <DLWrap desktop={desktop}>
                      <dt>
                        Path
                        <div className="tooltip-wrapper">
                          <Tooltip content={TOOLTIP_PACKAGE_PATH}>
                            <IconTooltip />
                          </Tooltip>
                        </div>
                      </dt>
                      <dd>
                        <Badge>
                          <Text type="p4" color="blue" className="ellipsis">
                            <Link
                              href={`/realms/details?path=${
                                message?.package?.path || message?.pkg_path || '-'
                              }`}
                              passHref>
                              <FitContentA>
                                {message?.package?.path || message?.pkg_path || '-'}
                              </FitContentA>
                            </Link>
                          </Text>
                          <Tooltip
                            content="Copied!"
                            trigger="click"
                            copyText={message?.package?.path || message?.pkg_path || '-'}
                            className="address-tooltip">
                            <StyledIconCopy />
                          </Tooltip>
                        </Badge>
                      </dd>
                    </DLWrap>
                  </>
                )}
                <DLWrap desktop={desktop}>
                  <dt>Type</dt>
                  <dd>
                    <Badge type="blue">
                      <Text type="p4" color="white">
                        {message['@type'] === '/vm.m_call' ? message?.func : message['@type']}
                      </Text>
                    </Badge>
                  </dd>
                </DLWrap>
                {/* {v.grc20 === true && v.type === '/vm.m_call' && v.type === 'Transfer' && (
                  <TransferContract contract={v} desktop={desktop} />
                )} */}
                {message['@type'] === '/bank.MsgSend' && (
                  <TransferContract message={message} desktop={desktop} />
                )}
                {message['@type'] === '/vm.m_addpkg' && (
                  <AddPkgContract message={message} desktop={desktop} />
                )}
                {!['/bank.MsgSend', '/vm.m_addpkg'].includes(message['@type']) && (
                  <CallerContract message={message} desktop={desktop} />
                )}
              </ContractListBox>
            ))}
            {transactionItem?.rawContent && (
              <ShowLog isTabLog={false} logData={transactionItem.rawContent} btnTextType="Logs" />
            )}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

const CallerContract = ({message, desktop}: any) => {
  const caller = useMemo(() => {
    return message?.caller || message?.creator;
  }, [message]);

  if (!message) return <></>;
  return (
    <DLWrap desktop={desktop} key={v1()}>
      <dt>Caller</dt>
      <dd>
        <Badge>
          <Link href={`/accounts/${caller || '-'}`} passHref>
            <FitContentA>
              <Text
                type="p4"
                color="blue"
                className={ellipsisTextKey.includes('Caller') ? 'ellipsis' : 'multi-line'}>
                {caller ? <Tooltip content={caller}>{caller}</Tooltip> : '-'}
              </Text>
            </FitContentA>
          </Link>
        </Badge>
      </dd>
    </DLWrap>
  );
};

const AddPkgContract = ({message, desktop}: any) => {
  return (
    <DLWrap desktop={desktop} key={v1()}>
      <dt>Creator</dt>
      <dd>
        <Badge>
          <Link href={`/accounts/${message?.package?.creator}`} passHref>
            <FitContentA>
              <Text type="p4" color="blue">
                {message?.creator || '-'}
              </Text>
            </FitContentA>
          </Link>
        </Badge>
      </dd>
    </DLWrap>
  );
};

const TransferContract = ({message, desktop}: any) => {
  return (
    <>
      <DLWrap desktop={desktop}>
        <dt>Amount</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              value={makeDisplayTokenAmount(parseTokenAmount(message?.amount || '0ugnot'))}
              denom={'GNOT'}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={desktop} key={v1()}>
        <dt>{'From'}</dt>
        <dd>
          <Badge>
            <AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={`/accounts/${message?.from_address}`} passHref>
                  <FitContentA>{message?.from_address}</FitContentA>
                </Link>
                {/* {contract.from_username && v === 'From' && (
                  <Text type="p4" color="primary" display="inline-block">
                    {` (${contract.from_username})`}
                  </Text>
                )} */}
                {/* {contract.to_username && v === 'To' && (
                  <Text type="p4" color="primary" display="inline-block">
                    {` (${contract.to_username})`}
                  </Text>
                )} */}
              </Text>
              <Tooltip
                content="Copied!"
                trigger="click"
                copyText={message?.from_address}
                className="address-tooltip">
                <StyledIconCopy />
              </Tooltip>
            </AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
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
  margin-left: 5px;
`;

export default TransactionDetails;
