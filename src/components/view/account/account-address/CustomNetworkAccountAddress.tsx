import React from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { useUsername } from "@/common/hooks/account/use-username";

import * as S from "./AccountAddress.styles";
import Text from "@/components/ui/text";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import AccountAddressSkeleton from "./AccountAddressSkeleton";
import { isBech32Address } from "@/common/utils/bech32.utility";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  address: string;
}

const CustomNetworkAccountAddress = ({ breakpoint, isDesktop, address }: AccountAddressProps) => {
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
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <S.Card isDesktop={isDesktop}>
      <Text aria-label="title" type={isDesktop ? "h4" : "h6"} color="primary">
        Address
      </Text>
      <S.Box isDesktop={isDesktop}>
        <S.AccountWrapper>
          <S.ContentWrapper>
            <S.Content type="p4" color="primary">
              {address}
              <S.CopyTooltip content="Copied!" trigger="click" copyText={address || ""}>
                <IconCopy />
              </S.CopyTooltip>
              {hasUsername && (
                <UsernameDependentComponent breakpoint={breakpoint} userName={userName} userUrl={userUrl} />
              )}
            </S.Content>
          </S.ContentWrapper>
        </S.AccountWrapper>
      </S.Box>
    </S.Card>
  );
};

interface UsernameDependentComponentProps {
  breakpoint: DEVICE_TYPE;
  userName: string | null;
  userUrl: string | null;
}

const UsernameDependentComponent = React.memo(({ breakpoint, userName, userUrl }: UsernameDependentComponentProps) => {
  return (
    <>
      <S.ContentWrapper>
        <Link href={userUrl || ""} target="_blank" rel="noreferrer">
          <S.Username type="p4" color="blue" breakpoint={breakpoint}>
            {userName}
            <IconLink />
          </S.Username>
        </Link>
      </S.ContentWrapper>
    </>
  );
});

UsernameDependentComponent.displayName = "UsernameDependentComponent";

export default CustomNetworkAccountAddress;
