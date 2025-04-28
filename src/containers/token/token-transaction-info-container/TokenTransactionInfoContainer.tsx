import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useUsername } from "@/common/hooks/account/use-username";

import TokenTransactionInfo from "@/components/view/token/token-transaction-info/TokenTranasctionInfo";

interface TokenTransactionInfoContainerProps {
  tokenPath: string;
}

const TokenTransactionInfoContainer = ({ tokenPath }: TokenTransactionInfoContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  const { isFetched: isFetchedToken } = useToken(tokenPath);
  const { isFetchedGRC20Tokens } = useTokenMeta();
  const { isFetched: isFetchedUsername } = useUsername();

  const isFetched = React.useMemo(
    () => isFetchedToken && isFetchedGRC20Tokens && isFetchedUsername,
    [isFetchedToken, isFetchedGRC20Tokens, isFetchedUsername],
  );

  return <TokenTransactionInfo tokenPath={tokenPath} isCustomNetwork={isCustomNetwork} isFetched={isFetched} />;
};

export default TokenTransactionInfoContainer;
