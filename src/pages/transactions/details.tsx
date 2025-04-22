/* eslint-disable @typescript-eslint/no-explicit-any */
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import { useUsername } from "@/common/hooks/account/use-username";
import { useRouter } from "@/common/hooks/common/use-router";
import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";
import { isDesktop } from "@/common/hooks/use-media";
import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { makeSafeBase64Hash } from "@/common/utils/transaction.utility";
import { DetailsPageLayout } from "@/components/core/layout";
import Badge from "@/components/ui/badge";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import Tooltip from "@/components/ui/tooltip";
import { EventDatatable } from "@/components/view/datatable/event";
import DataSection from "@/components/view/details-data-section";
import DataListSection from "@/components/view/details-data-section/data-list-section";
import mixins from "@/styles/mixins";
import { Transaction } from "@/types/data-type";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { v1 } from "uuid";

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on gno.land.
  </>
);

const ellipsisTextKey = ["Caller"];

function parseTxHash(url: string) {
  if (!url.includes("txhash=")) {
    return "";
  }
  const params = url.split("txhash=");
  if (params.length < 2) return "";

  const txHash = params[1].split("&")[0];
  const decodedTxHash = decodeURIComponent(txHash).replaceAll(" ", "+");
  return makeSafeBase64Hash(decodedTxHash);
}

const TransactionDetails = () => {
  const desktop = isDesktop();
  const { asPath, push } = useRouter();
  const { getUrlWithNetwork } = useNetwork();
  const hash = parseTxHash(asPath);
  const { gas, network, timeStamp, transactionItem, blockResult, transactionEvents, isFetched, isError } =
    useTransaction(hash);
  const [currentTab, setCurrentTab] = useState("Contract");

  const detailTabs = useMemo(() => {
    return [
      {
        tabName: "Contract",
      },
      {
        tabName: "Events",
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  const blockResultLog = useMemo(() => {
    if (transactionItem?.success !== false) {
      return null;
    }

    try {
      return JSON.stringify(blockResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionItem, blockResult]);

  useEffect(() => {
    if (hash === "") {
      push("/transactions");
    }
  }, [hash]);

  return (
    <DetailsPageLayout title={"Transaction Details"} visible={!isFetched} keyword={`${hash}`} error={isError}>
      {!isError && transactionItem && (
        <React.Fragment>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Success</dt>
              <dd>
                <Badge type={transactionItem.success ? "green" : "failed"}>
                  <Text type="p4" color="white">
                    {transactionItem.success ? "Success" : "Failure"}
                  </Text>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Timestamp</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {timeStamp.time}
                  </Text>
                  <DateDiffText>{timeStamp.passedTime}</DateDiffText>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Tx Hash</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {hash}
                  </Text>
                  <Tooltip content="Copied!" trigger="click" copyText={hash}>
                    <StyledIconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Network</dt>
              <dd>
                <Badge>{network}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Block</dt>
              <dd>
                <Badge>
                  <Link href={getUrlWithNetwork(`/blocks/${transactionItem.blockHeight}`)} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {transactionItem.blockHeight}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Transaction Fee</dt>
              <dd>
                <Badge>
                  <AmountText
                    minSize="body2"
                    maxSize="p4"
                    value={transactionItem.fee.value}
                    denom={transactionItem.fee.denom}
                  />
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Gas (Used/Wanted)</dt>
              <dd>
                <Badge>{gas}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Memo</dt>
              <dd>
                <Badge>{transactionItem.memo}</Badge>
              </dd>
            </DLWrap>
            {!transactionItem.success && (
              <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
            )}
          </DataSection>

          <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
            {currentTab === "Contract" && <ContractDetails transactionItem={transactionItem} desktop={desktop} />}
            {currentTab === "Events" && <EventDatatable events={transactionEvents} isFetched={isFetched} />}
          </DataListSection>
        </React.Fragment>
      )}
    </DetailsPageLayout>
  );
};

const ContractDetails: React.FC<{
  transactionItem: Transaction | null;
  desktop: boolean;
}> = ({ transactionItem, desktop }) => {
  const { tokenMap } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();

  const messages = useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

  const hasCaller = useCallback((message: any): boolean => {
    if (["/bank.MsgSend", "/vm.m_addpkg"].includes(message["@type"])) {
      return false;
    }

    if (message["@type"] === "/vm.m_call" && message?.func === "Transfer") {
      return false;
    }

    return true;
  }, []);

  const getContractType = useCallback((message: any) => {
    switch (message["@type"]) {
      case "/bank.MsgSend":
        return "Transfer";
      case "/vm.m_addpkg":
        return "AddPackage";
      case "/vm.m_call":
        return message["func"] || message["@type"];
      case "/vm.m_run":
        return "MsgRun";
    }
  }, []);

  if (!transactionItem) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {messages.map((message: any, i: number) => (
        <ContractListBox key={i}>
          {transactionItem.numOfMessage > 1 && (
            <Text type="h6" color="primary" margin="0px 0px 12px">{`#${i + 1}`}</Text>
          )}
          {message["@type"] !== "/bank.MsgSend" && (
            <>
              <DLWrap desktop={desktop}>
                <dt>Name</dt>
                <dd>
                  <Badge>
                    <Text type="p4" color="secondary">
                      {message?.package?.name || tokenMap?.[message?.pkg_path]?.name || message.func || "-"}
                    </Text>
                  </Badge>
                </dd>
              </DLWrap>
              <DLWrap desktop={desktop}>
                <dt>
                  Path
                  <div className="tooltip-wrapper">
                    <Tooltip content={TOOLTIP_PACKAGE_PATH}>
                      <IconTooltip />
                    </Tooltip>
                  </div>
                </dt>
                <dd>
                  <Badge>
                    <Text type="p4" color="blue" className="ellipsis">
                      <Link
                        href={getUrlWithNetwork(
                          `/realms/details?path=${message?.package?.path || message?.pkg_path || "-"}`,
                        )}
                        passHref
                      >
                        <FitContentA>
                          {formatDisplayPackagePath(message?.package?.path || message?.pkg_path || "-")}
                        </FitContentA>
                      </Link>
                    </Text>
                    <Tooltip
                      content="Copied!"
                      trigger="click"
                      copyText={message?.package?.path || message?.pkg_path || "-"}
                      className="address-tooltip"
                    >
                      <StyledIconCopy />
                    </Tooltip>
                  </Badge>
                </dd>
              </DLWrap>
            </>
          )}
          <DLWrap desktop={desktop}>
            <dt>Type</dt>
            <dd>
              <Badge type="blue">
                <Text type="p4" color="white">
                  {getContractType(message)}
                </Text>
              </Badge>
            </dd>
          </DLWrap>
          {message["@type"] === "/vm.m_call" && message?.func === "Transfer" && (
            <TransferContract message={message} desktop={desktop} />
          )}
          {message["@type"] === "/bank.MsgSend" && <TransferContract message={message} desktop={desktop} />}
          {message["@type"] === "/vm.m_addpkg" && <AddPkgContract message={message} desktop={desktop} />}
          {hasCaller(message) && <CallerContract message={message} desktop={desktop} />}
        </ContractListBox>
      ))}
      {transactionItem?.rawContent && (
        <ShowLog isTabLog={false} logData={transactionItem.rawContent} btnTextType="Logs" />
      )}
    </React.Fragment>
  );
};

const CallerContract = ({ message, desktop }: any) => {
  const { getUrlWithNetwork } = useNetwork();
  const caller = useMemo(() => {
    return message?.caller || message?.creator;
  }, [message]);

  if (!message) return <></>;
  return (
    <DLWrap desktop={desktop} key={v1()}>
      <dt>Caller</dt>
      <dd>
        <Badge>
          <Link href={getUrlWithNetwork(`/accounts/${caller || "-"}`)} passHref>
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

const AddPkgContract = ({ message, desktop }: any) => {
  const { getUrlWithNetwork } = useNetwork();
  const { getName } = useUsername();

  const creatorAddress = useMemo(() => {
    return message?.creator || "";
  }, [message?.creator]);

  const creatorName = useMemo(() => {
    return getName(creatorAddress) || creatorAddress || "";
  }, [getName, creatorAddress]);

  return (
    <DLWrap desktop={desktop} key={v1()}>
      <dt>Creator</dt>
      <dd>
        <Badge>
          <Link href={getUrlWithNetwork(`/accounts/${creatorAddress}`)} passHref>
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

const TransferContract = ({ message, desktop }: any) => {
  const { getUrlWithNetwork } = useNetwork();
  const { getTokenAmount } = useTokenMeta();

  const fromAddress = useMemo(() => {
    return message?.from_address || message?.caller || "-";
  }, [message]);

  const toAddress = useMemo(() => {
    return message?.to_address || message?.args?.[0] || "-";
  }, [message]);

  return (
    <>
      <DLWrap desktop={desktop}>
        <dt>Amount</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              {...getTokenAmount(GNOTToken.denom, parseTokenAmount(message?.amount || "0ugnot"))}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={desktop} key={v1()}>
        <dt>{"From"}</dt>
        <dd>
          <Badge>
            <AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/accounts/${fromAddress}`)} passHref>
                  <FitContentA>{fromAddress}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={fromAddress} className="address-tooltip">
                <StyledIconCopy />
              </Tooltip>
            </AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={desktop} key={v1()}>
        <dt>{"To"}</dt>
        <dd>
          <Badge>
            <AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/accounts/${toAddress}`)} passHref>
                  <FitContentA>{toAddress}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={toAddress} className="address-tooltip">
                <StyledIconCopy />
              </Tooltip>
            </AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
    </>
  );
};

const ContractListBox = styled.div`
  width: 100%;
  margin-top: 16px;
  & + & {
    margin-top: 32px;
  }
`;

const AddressTextBox = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;

const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;

export default TransactionDetails;
