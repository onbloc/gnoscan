import React, { useMemo } from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { useUpdateTime } from "@/common/hooks/main/use-update-time";
import { useGetNewestRealms } from "@/common/react-query/statistics";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { textEllipsis } from "@/common/utils/string-util";
import { getLocalDateString } from "@/common/utils/date-util";
import { NewestRealm } from "@/types/data-type";

import Text from "@/components/ui/text";
import ActiveList from "@/components/ui/active-list";
import { colWidth, FitContentA, List, listTitle, StyledCard, StyledText } from "../main-active-list";
import Tooltip from "@/components/ui/tooltip";
import FetchedSkeleton from "../fetched-skeleton";

function makeDisplayRealmPath(path: string, length = 11) {
  if (!path) {
    return "";
  }
  const displayPath = path.replace("gno.land", "");
  return displayPath.length > length ? displayPath.substring(0, length) + "..." : displayPath;
}

const StandardNetworkActiveNewest = () => {
  const { breakpoint } = useWindowSize();
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
        creatorName: item.publisherName || "",
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

  const getDisplayName = React.useCallback((address: string, addressName?: string) => {
    return addressName ? textEllipsis(addressName) : textEllipsis(address);
  }, []);

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Newest Realms
        {breakpoint !== DEVICE_TYPE.MOBILE && isFetched && isFetchedUpdatedAt && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(updatedAt)}`}
          </Text>
        )}
      </Text>
      {isFetched ? (
        <ActiveList title={listTitle.newest} colWidth={colWidth.newest}>
          {displayRealms.map((realm: NewestRealm, index: number) => (
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
                    <Tooltip content={realm.creator}>{getDisplayName(realm.creator, realm?.creatorName || "")}</Tooltip>
                  </Link>
                </FitContentA>
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[3]} color="reverse">
                {realm.functionCount || 0}
              </StyledText>
              <StyledText type="p4" width={colWidth.newest[4]} color="reverse">
                {realm.totalCalls || 0}
              </StyledText>
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
      {breakpoint === DEVICE_TYPE.MOBILE && isFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(updatedAt)}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default StandardNetworkActiveNewest;
