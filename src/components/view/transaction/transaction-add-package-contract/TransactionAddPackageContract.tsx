/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { v1 } from "uuid";

import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";

interface TransactionAddPackageContractProps {
  message: any;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

export const TransactionAddPackageContract = ({
  message,
  isDesktop,
  getUrlWithNetwork,
}: TransactionAddPackageContractProps) => {
  const creatorAddress = React.useMemo(() => {
    return message?.creator || message?.caller || "";
  }, [message?.creator]);

  const creatorName = React.useMemo(() => {
    return creatorAddress || "";
  }, [creatorAddress]);

  return (
    <DLWrap desktop={isDesktop} key={v1()}>
      <dt>Creator</dt>
      <dd>
        <Badge>
          <Link href={getUrlWithNetwork(`/account/${creatorAddress}`)} passHref>
            <FitContentA>
              <Text type="p4" color="blue" className={"ellipsis"}>
                {creatorAddress ? <Tooltip content={creatorAddress}>{creatorName}</Tooltip> : "-"}
              </Text>
            </FitContentA>
          </Link>
        </Badge>
      </dd>
    </DLWrap>
  );
};
