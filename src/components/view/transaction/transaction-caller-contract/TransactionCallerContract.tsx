/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { v1 } from "uuid";

import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";

interface TransactionCallerContractProps {
  message: any;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const ellipsisTextKey = ["Caller"];

export const TransactionCallerContract = ({
  message,
  isDesktop,
  getUrlWithNetwork,
}: TransactionCallerContractProps) => {
  const caller = React.useMemo(() => {
    return message?.caller || message?.creator;
  }, [message]);

  if (!message) return <></>;

  return (
    <DLWrap desktop={isDesktop} key={v1()}>
      <dt>Caller</dt>
      <dd>
        <Badge>
          <Link href={getUrlWithNetwork(`/account/${caller || "-"}`)} passHref>
            <FitContentA>
              <Text type="p4" color="blue" className={ellipsisTextKey.includes("Caller") ? "ellipsis" : "multi-line"}>
                {caller ? <Tooltip content={caller}>{caller}</Tooltip> : "-"}
              </Text>
            </FitContentA>
          </Link>
        </Badge>
      </dd>
    </DLWrap>
  );
};
