import React from 'react';
import styled from 'styled-components';
import IconSuccess from '@/assets/svgs/icon-status-success.svg';
import IconFail from '@/assets/svgs/icon-status-fail.svg';
import {RPC_URI} from '@/common/values/constant-value';
import {StatusKeyType} from '@/common/utils';

interface Props {
  txHash: string;
  status: StatusKeyType;
  development?: boolean;
  height?: number;
}

export const TxHash = ({txHash, status, development, height}: Props) => {
  const onClickIcon = () => {
    if (!development || !height) {
      return;
    }
    window.open(`${RPC_URI}/block_results?height=${height}`);
  };

  return (
    <TxHashWrapper>
      <a
        className="ellipsis"
        href={`/transactions/${txHash}`}
        target={'_blank'}
        rel={'noopener noreferrer'}>
        {txHash}
      </a>
      <span className="status" onClick={onClickIcon}>
        {status === 'failure' ? <IconFail /> : <IconSuccess />}
      </span>
    </TxHashWrapper>
  );
};

const TxHashWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;

    .status {
      display: flex;
      padding: 0 16px;
      justify-content: center;
      align-items: center;
    }
  }
`;
