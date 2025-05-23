import React from "react";

import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAddress.styles";
import Text from "@/components/ui/text";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import AccountAddressSkeleton from "./AccountAddressSkeleton";
import { Username } from "@/components/ui/username/Username";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  address: string;
}

const StandardNetworkAccountAddress = ({ isDesktop, address }: AccountAddressProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);

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
            {username && <Username username={username} />}
          </S.ContentWrapper>
        </S.AccountWrapper>
      </S.Box>
    </S.Card>
  );
};

export default StandardNetworkAccountAddress;
