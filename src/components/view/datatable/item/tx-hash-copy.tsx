import React from 'react';
import styled from 'styled-components';
import {textEllipsis} from '@/common/utils/string-util';
import Tooltip from '@/components/ui/tooltip';
import IconCopy from '@/assets/svgs/icon-copy.svg';

interface Props {
  txHash: string;
}

export const TxHashCopy = ({txHash}: Props) => {
  return (
    <TxHashWrapper>
      <a className="ellipsis" href={`/transactions/details?txhash=${txHash}`}>
        {textEllipsis(txHash ?? '', 8)}
      </a>
      <Tooltip
        className="path-copy-tooltip"
        content="Copied!"
        trigger="click"
        copyText={txHash}
        width={85}>
        <IconCopy className="svg-icon" />
      </Tooltip>
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
      justify-content: center;
      align-items: center;
      padding-right: 5px;
    }
  }
`;
