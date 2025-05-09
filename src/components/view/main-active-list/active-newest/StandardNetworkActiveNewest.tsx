/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import Text from "@/components/ui/text";
import { eachMedia } from "@/common/hooks/use-media";
import ActiveList from "@/components/ui/active-list";
import { colWidth, FitContentA, List, listTitle, StyledCard, StyledText } from "../main-active-list";
import Link from "next/link";
import Tooltip from "@/components/ui/tooltip";
import FetchedSkeleton from "../fetched-skeleton";
import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { getLocalDateString } from "@/common/utils/date-util";
import { useGetRealmFunctionsQuery, useGetRealmTransactionsQuery } from "@/common/react-query/realm";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { useUpdateTime } from "@/common/hooks/main/use-update-time";
import { useGetNewestRealms } from "@/common/react-query/statistics";
import { NewestRealm } from "@/types/data-type";

function makeDisplayRealmPath(path: string, length = 11) {
  if (!path) {
    return "";
  }
  const displayPath = path.replace("gno.land", "");
  return displayPath.length > length ? displayPath.substring(0, length) + "..." : displayPath;
}

const StandardNetworkActiveNewest = () => {
  const media = eachMedia();
  const { isFetched: isFetchedUpdatedAt } = useUpdateTime();
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetNewestRealms();

  const { realms, updatedAt }: { realms: NewestRealm[]; updatedAt: string } = React.useMemo(() => {
    if (!data?.items) return { realms: [], updatedAt: "" };

    const realms = data.items.map((item): NewestRealm => {
      return {
        hash: "",
        index: 0,
        success: false,
        blockHeight: item.block,
        packageName: "",
        packagePath: item.path,
        creator: item.publisher,
        functionCount: item.functions,
        totalCalls: item.calls,
        totalGasUsed: {
          value: "",
          denom: "",
        },
      };
    });

    return {
      realms,
      updatedAt: data.lastUpdated,
    };
  }, [data?.items]);

  const displayRealms = useMemo(() => {
    return realms.filter((_: unknown, index: number) => index < 10);
  }, [realms]);

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Newest Realms
        {media !== "mobile" && isFetched && isFetchedUpdatedAt && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(updatedAt)}`}
          </Text>
        )}
      </Text>
      {isFetched ? (
        <ActiveList title={listTitle.newest} colWidth={colWidth.newest}>
          {displayRealms.map((realm: any, index: number) => (
            <List key={index}>
              <StyledText type="p4" width={colWidth.newest[0]} color="tertiary">
                {index + 1}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[1]} color="blue">
                <Link href={getUrlWithNetwork(`/realms/details?path=${realm.packagePath}`)}>
                  <Tooltip content={realm.packagePath}>{makeDisplayRealmPath(realm.packagePath)}</Tooltip>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[2]} color="blue">
                <FitContentA>
                  <Link href={getUrlWithNetwork(`/account/${realm.creator}`)} passHref>
                    <Tooltip content={realm.creator}>{textEllipsis(realm.creator)}</Tooltip>
                  </Link>
                </FitContentA>
              </StyledText>
              <LazyFunctions path={realm.packagePath} />
              <LazyRealmCalls path={realm.packagePath} />
              <StyledText type="p4" width={colWidth.newest[5]} color="blue">
                <FitContentA>
                  <Link href={getUrlWithNetwork(`/block/${realm.blockHeight}`)} passHref>
                    {realm.blockHeight}
                  </Link>
                </FitContentA>
              </StyledText>
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}
      {media === "mobile" && isFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(updatedAt)}`}
        </Text>
      )}
    </StyledCard>
  );
};

const LazyFunctions: React.FC<{ path: string }> = ({ path }) => {
  const { data, isFetched } = useGetRealmFunctionsQuery(path);

  if (!isFetched) {
    return <SkeletonBar />;
  }

  return (
    <StyledText type="p4" width={colWidth.newest[3]} color="reverse">
      {data?.length || 0}
    </StyledText>
  );
};

const LazyRealmCalls: React.FC<{ path: string }> = ({ path }) => {
  const { data, isFetched } = useGetRealmTransactionsQuery(path);

  const totalCount = useMemo(() => {
    if (!data) {
      return 0;
    }
    return data.filter(tx => tx.type === "/vm.m_call").length;
  }, [data]);

  if (!isFetched) {
    return <SkeletonBar />;
  }

  return (
    <StyledText type="p4" width={colWidth.newest[4]} color="reverse">
      {totalCount}
    </StyledText>
  );
};

export default StandardNetworkActiveNewest;
