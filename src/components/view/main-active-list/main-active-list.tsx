import React from 'react';
import styled, {css} from 'styled-components';
import Card from '@/components/ui/card';
import mixins from '@/styles/mixins';
import {eachMedia} from '@/common/hooks/use-media';
import ActiveAccount from './active-account';
import ActiveBoards from './active-boards';
import Text from '@/components/ui/text';
import {AmountText} from '@/components/ui/text/amount-text';

export const listTitle = {
  accounts: ['No.', 'Account', 'Total Txs', 'Non-Transfer Txs', 'Balance (GNOT)'],
  boards: ['No.', 'Name', 'Replies', 'Reposts', 'Unique Users'],
  newest: ['No.', 'Name', 'Publisher', 'Functions', 'Calls', 'Block'],
};

export const colWidth = {
  accounts: ['52px', '127px', '114px', '138px', '127px'],
  boards: ['52px', '126.5px', '126.5px', '126.5px', '126.5px'],
  newest: ['52px', '101.2px', '101.2px', '101.2px', '101.2px', '101.2px'],
};

const MainActiveList = () => {
  const media = eachMedia();

  return (
    <Wrapper className={media}>
      <ActiveAccount />
      <ActiveBoards />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  margin: 16px 0px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
    margin: 32px 0px;
  }
`;

export const List = styled.div`
  ${mixins.flexbox('row', 'center', 'space-between')};
  min-width: 100%;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${({theme}) => theme.colors.dimmed50};
  }
`;

export const StyledCard = styled(Card)`
  overflow: hidden;
  width: 100%;
  min-height: 368px;
  max-height: 408px;
  .active-list-title {
    ${mixins.flexbox('row', 'center', 'space-between')};
  }
  .icon-link {
    stroke: ${({theme}) => theme.colors.reverse};
    margin-left: 4px;
  }
`;

const textStyle = css`
  padding: 12px;
  flex: 1;
  :first-of-type {
    max-width: 52px;
  }
  &.with-link {
    a {
      ${mixins.flexbox('row', 'center', 'flex-start')};
      width: 100%;
    }
  }
`;

export const StyledText = styled(Text)<{width: string}>`
  min-width: ${({width}) => width};
  ${textStyle};
`;

export const StyledAmountText = styled(AmountText)<{width: string}>`
  min-width: ${({width}) => width};
  ${textStyle};
`;

export default MainActiveList;
