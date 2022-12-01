import React from 'react';
import axios from 'axios';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import {formatAddress, formatEllipsis} from '@/common/utils';
import {ActiveList, StyledText} from '@/components/ui/active-list';
import {v1} from 'uuid';
import {colWidth, List, listTitle, StyledCard} from '../main-active-list';

type NewestValueType = {
  no: number;
  name: string;
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
  const {data: newest, isSuccess: newestSuccess}: UseQueryResult<NewestResultType> = useQuery(
    'info/newest_realm',
    async () => await axios.get('http://3.218.133.250:7677/v3/info/newest_realm'),
    {
      select: (res: any) => {
        const realms = res.data.realms.map((v: any, i: number) => {
          return {
            no: v.idx,
            name: formatEllipsis(v.pkg_name),
            publisher: Boolean(v.publisher)
              ? formatEllipsis(v.publisher)
              : formatAddress(v.publisher_address),
            functions: v.functions,
            calls: v.calls,
            block: v.block,
          };
        });
        return {
          last_update: res.data.last_update,
          data: realms,
        };
      },
      // onSuccess: res => console.log('Newest Data : ', res),
    },
  );

  return (
    <StyledCard>
      {newestSuccess && (
        <>
          <Text className="title" type="h6" color="primary">
            Newest Realms
            {media !== 'mobile' && (
              <Text type="body1" color="tertiary">
                {`Last Updated: ${newest?.last_update}`}
              </Text>
            )}
          </Text>
          <ActiveList title={listTitle.newest} colWidth={colWidth.newest}>
            <>
              {newest.data.map((v: NewestValueType) => (
                <List key={v1()}>
                  <StyledText type="p4" width={colWidth.newest[0]} color="reverse">
                    {v.no}
                  </StyledText>
                  <StyledText type="p4" width={colWidth.newest[1]} color="blue">
                    {v.name}
                  </StyledText>
                  <StyledText type="p4" width={colWidth.newest[2]} color="reverse">
                    {v.publisher}
                  </StyledText>
                  <StyledText type="p4" width={colWidth.newest[3]} color="reverse">
                    {v.functions}
                  </StyledText>
                  <StyledText type="p4" width={colWidth.newest[4]} color="reverse">
                    {v.calls}
                  </StyledText>
                  <StyledText type="p4" width={colWidth.newest[5]} color="reverse">
                    {v.block}
                  </StyledText>
                </List>
              ))}
            </>
          </ActiveList>
          {media === 'mobile' && (
            <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
              {`Last Updated: ${newest?.last_update}`}
            </Text>
          )}
        </>
      )}
    </StyledCard>
  );
};

export default ActiveNewest;
