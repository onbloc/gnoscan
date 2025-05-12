import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import BigNumber from "bignumber.js";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { getLocalDateString } from "@/common/utils/date-util";
import { useGetMonthlyActiveAccounts } from "@/common/react-query/statistics";
import { useNetwork } from "@/common/hooks/use-network";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { ActiveAccountModel } from "@/repositories/api/statistics/response";
import { textEllipsis } from "@/common/utils/string-util";
import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { useWindowSize } from "@/common/hooks/use-window-size";

import Text from "@/components/ui/text";
import ActiveList from "@/components/ui/active-list";
import { colWidth, List, listTitle, StyledAmountText, StyledCard, StyledText } from "../main-active-list";
import Tooltip from "@/components/ui/tooltip";
import FetchedSkeleton from "../fetched-skeleton";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

const ActiveAccountApi = () => {
  const { breakpoint } = useWindowSize();
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetMonthlyActiveAccounts();

  const loaded = useMemo(() => {
    return isFetched;
  }, [isFetched]);

  const accountsData: ActiveAccountModel[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(account => account ?? []);
  }, [data?.items]);

  const updatedAt = useMemo(() => {
    if (!data?.lastUpdated) return "";
    return data.lastUpdated;
  }, [data?.lastUpdated]);

  const getDisplayUsername = useCallback((address: string) => {
    return textEllipsis(address);
  }, []);

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Monthly Active Accounts
        {breakpoint !== DEVICE_TYPE.MOBILE && loaded && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(updatedAt)}`}
          </Text>
        )}
      </Text>
      {loaded ? (
        <ActiveList title={listTitle.accounts} colWidth={colWidth.accounts}>
          {accountsData.map((account: ActiveAccountModel, index: number) => (
            <List key={index}>
              <StyledText type="p4" width={colWidth.accounts[0]} color="tertiary">
                {index + 1}
              </StyledText>
              <StyledText className="with-link" type="p4" width={colWidth.accounts[1]} color="blue">
                <Link href={getUrlWithNetwork(`/account/${account.account}`)} passHref>
                  <span>
                    <Tooltip content={account.account}>{getDisplayUsername(account.account)}</Tooltip>
                  </span>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.accounts[2]} color="reverse">
                {account.totalTxs}
              </StyledText>
              <StyledText type="p4" width={colWidth.accounts[3]} color="reverse">
                {account.nonTransferTxs}
              </StyledText>
              <LazyAccountBalance address={account.account} />
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}
      {breakpoint === DEVICE_TYPE.MOBILE && loaded && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(updatedAt)}`}
        </Text>
      )}
    </StyledCard>
  );
};

const LazyAccountBalance = ({ address }: { address: string }) => {
  const { data, isFetched } = useGetNativeTokenBalance(address);

  if (!isFetched) {
    return <SkeletonBar width={colWidth.accounts[4]} />;
  }

  return (
    <StyledAmountText
      minSize="body2"
      maxSize="p4"
      color="reverse"
      value={BigNumber(data?.value || 0).shiftedBy(GNOTToken.decimals * -1)}
      width={colWidth.accounts[4]}
    />
  );
};

export default ActiveAccountApi;
