import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { ValidatorInfo } from "@/layouts/account/AccountLayout";

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

  // Curated EOA display name (e.g. "Kraken #1"); replaces the name tag in this header.
  // Realm labels hold a package path and those addresses redirect to the realm page, so skip them.
  const label = data?.data?.labelType !== ADDRESS_LABEL_TYPE.REALM ? data?.data?.label || null : null;

  const handleValidatorLinkClick = React.useCallback(() => {
    const url = `${gnoWebUrl}/r/gnops/valopers:${validatorInfo?.operationAddress}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [gnoWebUrl, validatorInfo?.operationAddress]);

  if (isLoading || !isFetched) {
    return <AccountAddressSkeleton isDesktop={isDesktop} />;
  }

  return (
    <S.Card isDesktop={isDesktop}>
      <Text aria-label="title" type={isDesktop ? "h4" : "h6"} color="primary" fontWeight={isDesktop ? 600 : undefined}>
        Address
      </Text>
      <S.Box isDesktop={isDesktop}>
        <S.AccountWrapper>
          <S.ContentWrapper isDesktop={isDesktop}>
            <S.Content type={isDesktop ? "p3" : "p4"} color="primary">
              {address}
              {label && ` (${label})`}
              <S.CopyTooltip variant="plain" copyText={address || ""} />
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
            {!validatorInfo && !label && username && <Username username={username} />}
          </S.ContentWrapper>
        </S.AccountWrapper>
      </S.Box>
    </S.Card>
  );
};

export default StandardNetworkAccountAddress;
