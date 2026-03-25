/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { v1 } from "uuid";

import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import ShowLog from "@/components/ui/show-log";
import { AmountBadge, BadgeList } from "../common";

interface TransactionMsgRunContractProps {
  message: any;
  isDesktop: boolean;
  files?: { name: string; body: string }[] | null;
  getUrlWithNetwork: (uri: string) => string;
}

export const TransactionMsgRunContract = ({ message, isDesktop, files = [] }: TransactionMsgRunContractProps) => {
  const send = React.useMemo(() => {
    if (!message?.send) return null;
    return toGNOTAmount(message.send.value, message.send.denom);
  }, [message?.send]);

  const maxDeposit = React.useMemo(() => {
    if (!message?.maxDeposit) return null;
    return toGNOTAmount(message.maxDeposit.value, message.maxDeposit.denom);
  }, [message?.maxDeposit]);

  const hasFiles = React.useMemo(() => {
    if (!files) return false;
    if (!Array.isArray(files)) return false;
    if (files.length === 0) return false;

    return true;
  }, [files]);

  return (
    <>
      {hasFiles && (
        <DLWrap desktop={isDesktop} key={v1()}>
          <DLWrap desktop={isDesktop} key={v1()}>
            <dt>Files</dt>
            <dd>
              <BadgeList items={files?.map(file => file.name) || []} />
              {files && files?.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Files" />}
            </dd>
          </DLWrap>
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
