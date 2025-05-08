import React, { useCallback, useMemo } from "react";
import Text from "@/components/ui/text";
import { eachMedia } from "@/common/hooks/use-media";
import ActiveList from "@/components/ui/active-list";
import { colWidth, List, listTitle, StyledAmountText, StyledCard, StyledText } from "../main-active-list";
import Link from "next/link";
import { getLocalDateString } from "@/common/utils/date-util";
import Tooltip from "@/components/ui/tooltip";
import FetchedSkeleton from "../fetched-skeleton";
import { useGetMonthlyActiveAccounts } from "@/common/react-query/statistics";
import { textEllipsis } from "@/common/utils/string-util";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { ActiveAccountModel } from "@/repositories/api/statistics/response";

const ActiveAccountApi = () => {
  const media = eachMedia();
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
        {media !== "mobile" && loaded && (
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
      {media === "mobile" && loaded && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(updatedAt)}`}
        </Text>
      )}
    </StyledCard>
  );
};

const LazyAccountBalance: React.FC<{ address: string }> = ({ address }) => {
  const { data, isFetched } = useGetNativeTokenBalance(address);

  if (!isFetched) {
    return <SkeletonBar />;
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
