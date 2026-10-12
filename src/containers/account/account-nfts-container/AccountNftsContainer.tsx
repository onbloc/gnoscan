import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import StandardNetworkAccountNfts from "@/components/view/account/account-nfts/StandardNetworkAccountNfts";

interface AccountNftsContainerProps {
  address: string;
}

// NFT holdings come from the API, which custom networks do not have.
const AccountNftsContainer = ({ address }: AccountNftsContainerProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return isCustomNetwork ? null : <StandardNetworkAccountNfts address={address} />;
};

export default AccountNftsContainer;
