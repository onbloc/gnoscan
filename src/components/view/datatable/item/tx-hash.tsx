import React from 'react';
import styled from 'styled-components';
import IconSuccess from '@/assets/svgs/icon-status-success.svg';
import IconFail from '@/assets/svgs/icon-status-fail.svg';
import {RPC_URI} from '@/common/values/constant-value';
import {StatusKeyType} from '@/common/utils';
import {textEllipsis} from '@/common/utils/string-util';

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
        {textEllipsis(txHash ?? '', 8)}
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
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    a {
      width: 100%;
    }

    .status {
      display: flex;
      padding-left: 16px;
      justify-content: center;
      align-items: center;
    }
  }
`;
