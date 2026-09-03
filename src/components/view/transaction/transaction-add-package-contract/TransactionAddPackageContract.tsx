/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import React from "react";
import { v1 } from "uuid";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import Badge from "@/components/ui/badge";
import { DLWrap, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import { AmountBadge, BadgeList } from "../common";

interface TransactionAddPackageContractProps {
  message: any;
  isDesktop: boolean;
  files?: { name: string; body: string }[] | null;
  getUrlWithNetwork: (uri: string) => string;
}

export const TransactionAddPackageContract = ({
  message,
  isDesktop,
  files = [],
  getUrlWithNetwork,
}: TransactionAddPackageContractProps) => {
  const send = React.useMemo(() => {
    if (!message?.send) return null;
    return toGNOTAmount(message.send.value, message.send.denom);
  }, [message?.send]);

  const maxDeposit = React.useMemo(() => {
    if (!message?.maxDeposit) return null;
    return toGNOTAmount(message.maxDeposit.value, message.maxDeposit.denom);
  }, [message?.maxDeposit]);

  const creatorAddress = React.useMemo(() => {
    return message?.creator || message?.caller || "";
  }, [message?.creator]);

  const creatorName = React.useMemo(() => {
    return creatorAddress || "";
  }, [creatorAddress]);

  const hasFiles = React.useMemo(() => {
    if (!files) return false;
    if (!Array.isArray(files)) return false;
    if (files.length === 0) return false;
    return true;
  }, [files]);

  return (
    <>
      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>Creator</dt>
        <dd>
          <Badge>
            <Link href={getUrlWithNetwork(`/account/${creatorAddress}`)} passHref>
              <FitContentSpan>
                <Text type="p4" color="blue" className={"ellipsis"}>
                  {creatorAddress ? <Tooltip content={creatorAddress}>{creatorName}</Tooltip> : "-"}
                </Text>
              </FitContentSpan>
            </Link>
          </Badge>
        </dd>
      </DLWrap>

      {hasFiles && (
        <DLWrap desktop={isDesktop} key={v1()}>
          <dt>Files</dt>
          <dd>
            <BadgeList items={files?.map(file => file.name) || []} />
            {files && files?.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Files" />}
          </dd>
        </DLWrap>
      )}

      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>Send</dt>
        <dd>
          <AmountBadge amount={send} />
        </dd>
      </DLWrap>

      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>Max Deposit</dt>
        <dd>
          <AmountBadge amount={maxDeposit} />
        </dd>
      </DLWrap>
    </>
  );
};
