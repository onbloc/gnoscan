import React from "react";
import Link from "next/link";

import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { useNetwork } from "@/common/hooks/use-network";

import * as S from "./AccountAddress.styles";
import Text from "@/components/ui/text";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import AccountAddressSkeleton from "./AccountAddressSkeleton";
import { Divider } from "@/components/ui/divider/Divider";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  address: string;
}

const StandardNetworkAccountAddress = ({ breakpoint, isDesktop, address }: AccountAddressProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);
  const { getUrlWithNetwork } = useNetwork();

  const username: string | null = React.useMemo(() => {
    if (!data?.data || !data?.data?.name) return null;
    return data.data.name;
  }, [data?.data.name]);

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
          <S.ContentWrapper isDesktop={isDesktop}>
            <S.Content type="p4" color="primary">
              {address}
              <S.CopyTooltip content="Copied!" trigger="click" copyText={address || ""}>
                <IconCopy />
              </S.CopyTooltip>
            </S.Content>
            {username && (
              <UsernameDependentComponent
                breakpoint={breakpoint}
                userName={username}
                userUrl={getUrlWithNetwork(`/account/${address}`)}
              />
            )}
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
  const isDesktop = breakpoint === DEVICE_TYPE.DESKTOP;

  return (
    <>
      <S.ContentWrapper isDesktop={isDesktop}>
        {/* <div style={{ width: 1, height: 18, border: "none", borderLeft: "1px solid black" }} /> */}
        <Divider size={1} length={18} orientation="vertical" />
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
