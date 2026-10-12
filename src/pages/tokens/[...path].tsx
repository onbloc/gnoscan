import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api";

import TokenLayout from "@/layouts/token/TokenLayout";
import TokenSummaryContainer from "@/containers/token/token-summary-container/TokenSummaryContainer";
import TokenTransactionInfoContainer from "@/containers/token/token-transaction-info-container/TokenTransactionInfoContainer";
import NftCollectionSummary from "@/components/view/nft/collection-summary/NftCollectionSummary";
import NftCollectionTabs from "@/components/view/nft/collection-tabs/NftCollectionTabs";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

export default function Page() {
  const router = useRouter();
  const { path } = router.query;
  const tokenId = (Array.isArray(path) ? path.join("/").split("?")[0] : path?.toString()) || "";

  const { isCustomNetwork } = useNetworkProvider();
  // GRC721 collections share this route with GRC20 tokens; token-meta tells them apart.
  const { data: tokenMeta, isFetched: isFetchedTokenMeta } = useGetTokenMetaByPath(tokenId, {
    enabled: !isCustomNetwork,
  });

  if (!isCustomNetwork && !isFetchedTokenMeta) {
    return <TokenLayout tokenSummary={<TableSkeleton />} tokenTransactionInfo={null} />;
  }

  if (tokenMeta?.data?.tokenType === "GRC721") {
    return (
      <TokenLayout
        title="NFT Details"
        tokenSummary={<NftCollectionSummary tokenKey={tokenId} />}
        tokenTransactionInfo={<NftCollectionTabs tokenKey={tokenId} symbol={tokenMeta.data.symbol} />}
      />
    );
  }

  return (
    <TokenLayout
      tokenSummary={<TokenSummaryContainer tokenId={tokenId} />}
      tokenTransactionInfo={<TokenTransactionInfoContainer tokenId={tokenId} />}
    />
  );
}
