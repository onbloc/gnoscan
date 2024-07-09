import React, {useMemo} from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import ActiveList from '@/components/ui/active-list';
import {colWidth, FitContentA, List, listTitle, StyledCard, StyledText} from '../main-active-list';
import Link from 'next/link';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {useRealms} from '@/common/hooks/realms/use-realms';
import {useNetwork} from '@/common/hooks/use-network';
import {textEllipsis} from '@/common/utils/string-util';

function makeDisplayRealmPath(path: string, length = 11) {
  const displayPath = path.replace('gno.land', '');
  return displayPath.length > length ? displayPath.substring(0, length) + '...' : displayPath;
}

const ActiveNewest = () => {
  const media = eachMedia();
  const {getUrlWithNetwork} = useNetwork();
  const {isFetched, realms} = useRealms(false);

  const displayRealms = useMemo(() => {
    return realms.filter((_: unknown, index: number) => index < 10);
  }, [realms]);

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Newest Realms
        {media !== 'mobile' && isFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${new Date().toLocaleDateString()}`}
          </Text>
        )}
      </Text>
      {isFetched ? (
        <ActiveList title={listTitle.newest} colWidth={colWidth.newest}>
          {displayRealms.map((realm: any, index: number) => (
            <List key={index}>
              <StyledText type="p4" width={colWidth.newest[0]} color="tertiary">
                {realm.index + 1}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[1]} color="blue">
                <Link href={getUrlWithNetwork(`/realms/details?path=${realm.packagePath}`)}>
                  <a>
                    <Tooltip content={realm.packagePath}>
                      {makeDisplayRealmPath(realm.packagePath)}
                    </Tooltip>
                  </a>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[2]} color="blue">
                <Link href={getUrlWithNetwork(`/accounts/${realm.creator}`)} passHref>
                  <FitContentA>
                    <Tooltip content={realm.creator}>{textEllipsis(realm.creator)}</Tooltip>
                  </FitContentA>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[3]} color="reverse">
                {realm.functionCount}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[4]} color="reverse">
                {realm.totalCalls}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[5]} color="blue">
                <Link href={getUrlWithNetwork(`/blocks/${realm.blockHeight}`)} passHref>
                  <FitContentA>{realm.blockHeight}</FitContentA>
                </Link>
              </StyledText>
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}
      {media === 'mobile' && isFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${new Date().toLocaleDateString()}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveNewest;
