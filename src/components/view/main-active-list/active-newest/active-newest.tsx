import React from 'react';
import axios from 'axios';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import {formatAddress, formatEllipsis} from '@/common/utils';
import ActiveList from '@/components/ui/active-list';
import {v1} from 'uuid';
import {colWidth, FitContentA, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import Link from 'next/link';
import {API_URI} from '@/common/values/constant-value';
import {getLocalDateString} from '@/common/utils/date-util';
import IconLink from '@/assets/svgs/icon-link.svg';
import styled from 'styled-components';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';

type NewestValueType = {
  no: number;
  originName: string;
  formatName: string;
  originPkgName: string;
  originAddress: string;
  publisher: string;
  functions: number;
  calls: number;
  block: number;
};

interface NewestResultType {
  last_update: string;
  data: NewestValueType[];
}

const ActiveNewest = () => {
  const media = eachMedia();
  const {
    data: newest,
    isSuccess: newestSuccess,
    isFetched: newestFetched,
  }: UseQueryResult<NewestResultType> = useQuery(
    ['info/newest_realm'],
    async () => await axios.get(API_URI + '/latest/info/newest_realm'),
    {
      select: (res: any) => {
        const realms = res.data.realms.map((v: any, i: number) => {
          return {
            no: v.idx,
            originName: v.pkg_path,
            formatName: formatEllipsis(v.pkg_name),
            originPkgName: v.pkg_name,
            originAddress: v.publisher_address,
            publisher: Boolean(v.publisher) ? v.publisher : formatAddress(v.publisher_address),
            functions: v.functions,
            calls: v.calls,
            block: v.block,
          };
        });
        return {
          last_update: getLocalDateString(res.data.last_update),
          data: realms,
        };
      },
      // onSuccess: res => console.log('Newest Data : ', res),
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
          {newest?.data.map((v: NewestValueType, i: number) => (
            <List key={v1()}>
              <StyledText type="p4" width={colWidth.newest[0]} color="tertiary">
                {v.no}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[1]} color="blue">
                <Link href={`/realms/details?path=${v.originName}`}>
                  <a target="_blank">
                    <Tooltip content={v.originPkgName}>{v.formatName}</Tooltip>
                  </a>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[2]} color="blue">
                <Link href={`/accounts/${v.originAddress}`} passHref>
                  <FitContentA target="_blank">
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
                  <FitContentA target="_blank">{v.block}</FitContentA>
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
