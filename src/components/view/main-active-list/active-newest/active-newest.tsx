import React from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import ActiveList from '@/components/ui/active-list';
import {v1} from 'uuid';
import {colWidth, FitContentA, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import Link from 'next/link';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {NewestDataType, NewestListModel} from '@/models/active-list-model';
import {getNewestList} from '@/repositories/api/fetchers/api-active-list';
import {newestListSelector} from '@/repositories/api/selector/select-active-list';

const ActiveNewest = () => {
  const media = eachMedia();
  const {data: newest, isFetched: newestFetched}: UseQueryResult<NewestListModel> = useQuery(
    ['info/newest_realm'],
    async () => await getNewestList(),
    {
      select: (res: any) => newestListSelector(res.data),
    },
  );

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Newest Realms
        {media !== 'mobile' && newestFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${newest?.last_update}`}
          </Text>
        )}
      </Text>
      {newestFetched ? (
        <ActiveList title={listTitle.newest} colWidth={colWidth.newest}>
          {newest?.data.map((v: NewestDataType, i: number) => (
            <List key={v1()}>
              <StyledText type="p4" width={colWidth.newest[0]} color="tertiary">
                {v.no}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[1]} color="blue">
                <Link href={`/realms/details?path=${v.originName}`}>
                  <a>
                    <Tooltip content={v.originPkgName}>{v.formatName}</Tooltip>
                  </a>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[2]} color="blue">
                <Link href={`/accounts/${v.originAddress}`} passHref>
                  <FitContentA>
                    <Tooltip content={v.originAddress}>{v.publisher}</Tooltip>
                  </FitContentA>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[3]} color="reverse">
                {v.functions}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[4]} color="reverse">
                {v.calls}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[5]} color="blue">
                <Link href={`/blocks/${v.block}`} passHref>
                  <FitContentA>{v.block}</FitContentA>
                </Link>
              </StyledText>
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}
      {media === 'mobile' && newestFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${newest?.last_update}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveNewest;
