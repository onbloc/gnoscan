import React from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import ActiveList from '@/components/ui/active-list';
import {v1} from 'uuid';
import {colWidth, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import IconLink from '@/assets/svgs/icon-link.svg';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {BoardDataType, BoardListModel} from '@/models/active-list-model';
import {getBoardList} from '@/repositories/api/fetchers/api-active-list';
import {boardListSelector} from '@/repositories/api/selector/select-active-list';
import {useMonthlyActiveBoards} from '@/common/hooks/main/use-monthly-active-boards';
import {getLocalDateString} from '@/common/utils/date-util';

const ActiveBoards = () => {
  const media = eachMedia();
  const {data: boards, isFetched: boardsFetched} = useMonthlyActiveBoards();

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
                  <a href={board.boardId}>
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
