import React from "react";
import Link from "next/link";

import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { useNetwork } from "@/common/hooks/use-network";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAddress.styles";
import Text from "@/components/ui/text";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import AccountAddressSkeleton from "./AccountAddressSkeleton";
import { useUsername } from "@/common/hooks/account/use-username";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  address: string;
}

const StandardNetworkAccountAddress = ({ breakpoint, isDesktop, address }: AccountAddressProps) => {
  const { isLoading, isFetched } = useGetAccountByAddress(address);
  // const hasUsername = React.useMemo(() => Boolean(userName), [userName]);

  if (isLoading || !isFetched) {
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
              {false && <UsernameDependentComponent breakpoint={breakpoint} userName={""} userUrl={""} />}
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

export default StandardNetworkAccountAddress;
