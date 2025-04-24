import React from "react";
import Link from "next/link";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./AccountAddress.styles";
import Text from "@/components/ui/text";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import AccountAddressSkeleton from "./AccountAddressSkeleton";

interface AccountAddressProps {
  breakpoint: DEVICE_TYPE;
  isDesktop: boolean;
  isFetched: boolean;
  isLoading: boolean;
  address: string;
  userName: string | null;
  userUrl: string | null;
}

const AccountAddress = ({
  breakpoint,
  isDesktop,
  isFetched,
  isLoading,
  address,
  userName,
  userUrl,
}: AccountAddressProps) => {
  const hasUsername = React.useMemo(() => Boolean(userName), [userName]);

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

const UsernameDependentComponent = React.memo(
  ({ breakpoint, userName, userUrl }: Pick<AccountAddressProps, "breakpoint" | "userName" | "userUrl">) => {
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
  },
);

UsernameDependentComponent.displayName = "UsernameDependentComponent";

export default AccountAddress;
