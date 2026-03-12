import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { ValidatorInfo } from "@/layouts/account/AccountLayout";

import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import { LinkWrapper } from "@/components/ui/detail-page-common-styles";
import { Divider } from "@/components/ui/divider/Divider";
import Text from "@/components/ui/text";
import { Username } from "@/components/ui/username/Username";
import * as S from "./AccountAddress.styles";
import AccountAddressSkeleton from "./AccountAddressSkeleton";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  address: string;
  validatorInfo?: ValidatorInfo | null;
}

const StandardNetworkAccountAddress = ({ isDesktop, address, validatorInfo }: AccountAddressProps) => {
  const { data, isLoading, isFetched } = useGetAccountByAddress(address);
  const { gnoWebUrl } = useNetwork();

  const username: string | null = React.useMemo(() => {
    if (!data?.data || !data?.data?.name) return null;
    return data.data.name;
  }, [data?.data.name]);

  const handleValidatorLinkClick = React.useCallback(() => {
    const url = `${gnoWebUrl}/r/gnops/valopers:${address}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [gnoWebUrl, address]);

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
            {validatorInfo?.name && (
              <>
                <Divider size={1} length={18} orientation="vertical" />
                <LinkWrapper onClick={handleValidatorLinkClick} rel="noreferrer">
                  <Text type="p4" color="primary">
                    {validatorInfo.name}
                  </Text>
                  {gnoWebUrl && <IconLink />}
                </LinkWrapper>
              </>
            )}
            {!validatorInfo && username && <Username username={username} />}
          </S.ContentWrapper>
        </S.AccountWrapper>
      </S.Box>
    </S.Card>
  );
};

export default StandardNetworkAccountAddress;
