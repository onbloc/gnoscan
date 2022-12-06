import React from 'react';
import styled from 'styled-components';
import IconSuccess from '@/assets/svgs/icon-status-success.svg';
import IconFail from '@/assets/svgs/icon-status-fail.svg';
import Link from 'next/link';

interface Props {
  txHash: string;
  success: boolean;
}

export const TxHash = ({txHash, success}: Props) => {
  return (
    <TxHashWrapper>
      <Link className="ellipsis" href={`/transactions/${txHash}`}>
        {txHash}
      </Link>
      <span className="status">{success ? <IconSuccess /> : <IconFail />}</span>
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
