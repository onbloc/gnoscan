import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";
import { isBech32Address } from "@/common/utils/bech32.utility";

import * as S from "./AccountAddress.styles";
import AccountAddressSkeleton from "./AccountAddressSkeleton";
import { Username } from "@/components/ui/username/Username";

interface AccountAddressProps {
  address: string;
}

const CustomNetworkAccountAddress = ({ address }: AccountAddressProps) => {
  const { currentNetwork } = useNetwork();

  const { isFetched: isFetchedUsername, isLoading: isLoadingUsername, getName, getAddress, getUserUrl } = useUsername();

  const bech32Address = React.useMemo(() => {
    if (!isFetchedUsername) return "";
    if (isBech32Address(address)) return address;
    return getAddress(address) || "";
  }, [address, isFetchedUsername, getAddress]);

  const userName = React.useMemo(() => {
    if (!isFetchedUsername || !bech32Address) return null;
    return getName(bech32Address);
  }, [bech32Address, isFetchedUsername, getName]);

  const userUrl = React.useMemo(() => {
    if (!userName || !currentNetwork) return null;
    return getUserUrl(currentNetwork.chainId, userName);
  }, [currentNetwork, userName]);

  const hasUsername = React.useMemo(() => Boolean(userName), [userName]);

  if (isLoadingUsername || !isFetchedUsername) {
    return <AccountAddressSkeleton />;
  }

  return (
    <S.Card>
      <S.CardTitle aria-label="title">Address</S.CardTitle>
      <S.Box>
        <S.AccountWrapper>
          <S.ContentWrapper>
            <S.Content type="p4" desktopType="p3" color="primary">
              {address}
              <S.CopyTooltip variant="plain" copyText={address || ""} />
              {hasUsername && <Username username={userName} userUrl={userUrl} />}
            </S.Content>
          </S.ContentWrapper>
        </S.AccountWrapper>
      </S.Box>
    </S.Card>
  );
};

interface UsernameDependentComponentProps {
  userName: string | null;
  userUrl: string | null;
}

export default CustomNetworkAccountAddress;
