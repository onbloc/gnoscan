import React from 'react';
import styled from 'styled-components';
import {textEllipsis} from '@/common/utils/string-util';
import Tooltip from '@/components/ui/tooltip';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {useNetwork} from '@/common/hooks/use-network';

interface Props {
  caller: string;
  username?: string | undefined;
}

export const CallerCopy = ({caller, username}: Props) => {
  const {getUrlWithNetwork} = useNetwork();
  return (
    <CallerWrapper>
      <a className="ellipsis" href={getUrlWithNetwork(`/accounts/${caller}`)}>
        {username || textEllipsis(caller ?? '', 6)}
        <Tooltip
          className="path-copy-tooltip"
          content="Copied!"
          trigger="click"
          copyText={caller}
          width={85}>
          <IconCopy className="svg-icon" />
        </Tooltip>
      </a>
    </CallerWrapper>
  );
};

const CallerWrapper = styled.div`
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
