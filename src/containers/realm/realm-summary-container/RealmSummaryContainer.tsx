import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useRealm } from "@/common/hooks/realms/use-realm";
import { useUsername } from "@/common/hooks/account/use-username";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetRealmTransactionsQuery } from "@/common/react-query/realm";

import RealmSummary from "@/components/view/realm/realm-summary/RealmSummary";

interface RealmSummaryContainerProps {
  path: string;
}

const RealmSummaryContainer = ({ path }: RealmSummaryContainerProps) => {
  const { isDesktop } = useWindowSize();

  const { summary, isFetched } = useRealm(path);
  const { data: realmTransactions, isFetched: isFetchedRealmTransactions } = useGetRealmTransactionsQuery(path);
  const { currentNetwork, getUrlWithNetwork } = useNetwork();
  const { getName } = useUsername();
  const { getTokenAmount } = useTokenMeta();

  return (
    <RealmSummary
      path={path}
      isDesktop={isDesktop}
      isFetched={isFetched}
      isFetchedRealmTransactions={isFetchedRealmTransactions}
      summary={summary}
      realmTransactions={realmTransactions}
      currentNetwork={currentNetwork}
      getUrlWithNetwork={getUrlWithNetwork}
      getName={getName}
      getTokenAmount={getTokenAmount}
    />
  );
};

export default RealmSummaryContainer;
