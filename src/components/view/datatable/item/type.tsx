import Tooltip from '@/components/ui/tooltip';
import theme from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';

interface Props {
  type: string;
  func: string;
  packagePath?: string | null;
}

export const Type = ({type, func, packagePath}: Props) => {
  const renderTooltip = () => {
    return (
      <TooltipWrapper>
        <span className="title">{type}</span>
        {packagePath && packagePath !== null ? (
          <span className="info">{packagePath.replace('gno.land', '')}</span>
        ) : (
          <></>
        )}
      </TooltipWrapper>
    );
  };

  return func ? (
    <TypeWrapper>
      <Tooltip content={renderTooltip()}>
        <span className="function">{func}</span>
      </Tooltip>
    </TypeWrapper>
  ) : (
    <span>-</span>
  );
};

const TypeWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;

    .function {
      display: flex;
      padding: 4px 16px;
      color: #fff;
      background-color: ${({theme}) => theme.colors.blue};
      border-radius: 4px;
    }
  }
`;

const TooltipWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      width: 100%;
      ${theme.fonts.p4};
      justify-content: flex-start;
      align-items: center;
    }

    .title {
      color: ${({theme}) => theme.colors.secondary};
    }

    .info {
      width: 100%;
      height: fit-content;
      padding: 6px 10px;
      margin-top: 4px;
      color: ${({theme}) => theme.colors.reverse};
      background-color: ${({theme}) => theme.colors.pantone};
      border-radius: 4px;
    }
  }
`;
