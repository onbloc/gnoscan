import React, {useCallback} from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import ActiveList from '@/components/ui/active-list';
import {colWidth, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import IconLink from '@/assets/svgs/icon-link.svg';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {useMonthlyActiveBoards} from '@/common/hooks/main/use-monthly-active-boards';
import {getLocalDateString} from '@/common/utils/date-util';
import {useNetwork} from '@/common/hooks/use-network';

const ActiveBoards = () => {
  const media = eachMedia();
  const {currentNetwork} = useNetwork();
  const {data: boards, isFetched: boardsFetched} = useMonthlyActiveBoards();

  const getBoardLink = useCallback(
    (boardId: string) => {
      const prefix = currentNetwork?.chainId === 'portal-loop' ? '' : currentNetwork?.chainId;
      if (!prefix) {
        return `https://gno.land/r/demo/boards:${boardId}`;
      }
      return `https://${prefix}.gno.land/r/demo/boards:${boardId}`;
    },
    [currentNetwork?.chainId],
  );

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Monthly Active Boards
        {media !== 'mobile' && boardsFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(Date.now())}`}
          </Text>
        )}
      </Text>
      {boardsFetched ? (
        <ActiveList title={listTitle.boards} colWidth={colWidth.boards}>
          {boards?.map(
            (
              board: {
                boardId: string;
                replies: number;
                reposts: number;
                uniqueUsers: number;
              },
              index: number,
            ) => (
              <List key={index}>
                <StyledText type="p4" width={colWidth.boards[0]} color="tertiary">
                  {index + 1}
                </StyledText>
                <StyledText type="p4" width={colWidth.boards[1]} color="blue" className="with-link">
                  <a href={getBoardLink(board.boardId)} target="_blank" rel="noreferrer">
                    <Tooltip content={board.boardId}>
                      <>
                        {board.boardId}
                        <IconLink className="icon-link" />
                      </>
                    </Tooltip>
                  </a>
                </StyledText>
                <StyledText type="p4" width={colWidth.boards[2]} color="reverse">
                  {board.replies}
                </StyledText>
                <StyledText type="p4" width={colWidth.boards[3]} color="reverse">
                  {board.reposts}
                </StyledText>
                <StyledText type="p4" width={colWidth.boards[4]} color="reverse">
                  {board.uniqueUsers}
                </StyledText>
              </List>
            ),
          )}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}

      {media === 'mobile' && boardsFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(Date.now())}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveBoards;
