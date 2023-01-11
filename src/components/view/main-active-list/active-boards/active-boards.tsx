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

const ActiveBoards = () => {
  const media = eachMedia();
  const {data: boards, isFetched: boardsFetched}: UseQueryResult<BoardListModel> = useQuery(
    ['info/most_active_board'],
    async () => await getBoardList(),
    {
      select: (res: any) => boardListSelector(res.data),
    },
  );

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Monthly Active Boards
        {media !== 'mobile' && boardsFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${boards?.last_update}`}
          </Text>
        )}
      </Text>
      {boardsFetched ? (
        <ActiveList title={listTitle.boards} colWidth={colWidth.boards}>
          {boards?.data.map((v: BoardDataType) => (
            <List key={v1()}>
              <StyledText type="p4" width={colWidth.boards[0]} color="tertiary">
                {v.no}
              </StyledText>
              <StyledText type="p4" width={colWidth.boards[1]} color="blue" className="with-link">
                <a href={v.boardLink} target="_blank" rel="noreferrer">
                  <Tooltip content={v.hovertext}>
                    <>
                      {v.formatName}
                      <IconLink className="icon-link" />
                    </>
                  </Tooltip>
                </a>
              </StyledText>
              <StyledText type="p4" width={colWidth.boards[2]} color="reverse">
                {v.replies}
              </StyledText>
              <StyledText type="p4" width={colWidth.boards[3]} color="reverse">
                {v.reposts}
              </StyledText>
              <StyledText type="p4" width={colWidth.boards[4]} color="reverse">
                {v.uniqueUsers}
              </StyledText>
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}

      {media === 'mobile' && boardsFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${boards?.last_update}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveBoards;
