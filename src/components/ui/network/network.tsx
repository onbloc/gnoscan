import React from 'react';
import styled from 'styled-components';
import GnoscanSymbol from '@/assets/svgs/icon-gnoscan-symbol.svg';
import Text from '@/components/ui/text';
import theme from '@/styles/theme';
import mixins from '@/styles/mixins';
import useOutSideClick from '@/common/hooks/use-outside-click';
import {zindex} from '@/common/values/z-index';
import {ChainModel} from '@/models/chain-model';

export interface NetworkData {
  all: string[];
  current: string;
}

interface StyleProps {
  entry?: boolean;
  toggle?: boolean;
  ref?: any;
}

interface NetworkProps extends StyleProps {
  chains: ChainModel[];
  currentChainId: string;
  toggleHandler: () => void;
  networkSettingHandler: (chainId: string) => void;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const Network = ({
  entry,
  currentChainId,
  chains,
  toggle,
  toggleHandler,
  networkSettingHandler,
  setToggle,
}: NetworkProps) => {
  const ref = useOutSideClick(() => setToggle(false));

  return (
    <NetworkButton entry={entry} onClick={toggleHandler} ref={ref}>
      <GnoscanSymbol className="svg-icon" width="24" height="24" />
      <NetworkList toggle={toggle} entry={entry}>
        {chains.map((chain: ChainModel, index: number) => (
          <li
            onClick={e => {
              e.stopPropagation();
              networkSettingHandler(chain.chainId);
            }}
            key={index}
            className={currentChainId === chain.chainId ? 'selected' : ''}>
            <Text type="p4">{chain.name}</Text>
          </li>
        ))}
      </NetworkList>
    </NetworkButton>
  );
};

const NetworkButton = styled.button<StyleProps>`
  position: relative;
  display: flex;
  background-color: ${({entry}) => (entry ? theme.lightTheme.reverse : theme.lightTheme.base)};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const NetworkList = styled.ul<StyleProps>`
  opacity: ${({toggle}) => (toggle ? '1' : '0')};
  visibility: ${({toggle}) => (toggle ? 'visible' : 'hidden')};
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.dimmed50};
  padding: 8px;
  transition: all 0.3s ease;
  transform: ${({toggle}) => (toggle ? 'scale(1)' : 'scale(0.5)')};
  z-index: ${zindex.scrollbar};
  width: 106px;
  ${({toggle}) => mixins.posMoveToTopAndRight(toggle ? '50px' : '0px')};
  & li {
    ${mixins.flexbox('row', 'center', 'center')};
    color: ${({theme}) => theme.colors.tertiary};
    height: 36px;
    transition: background-color 0.4s ease;
    cursor: pointer;
    border-radius: 8px;
    &.selected {
      background-color: ${({theme}) => theme.colors.select};
      color: ${({theme}) => theme.colors.reverse};
    }
  }
`;

export default Network;
