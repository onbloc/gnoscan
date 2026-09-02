/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import DataSection from "../../details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useMappedApiBlock } from "@/common/services/block/use-mapped-api-block";
import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";
import { toDisplayHash } from "@/common/utils/transaction.utility";
import { StyledIconCopy } from "./Block.styles";

interface BlockSummaryProps {
  isDesktop: boolean;
  blockHeight: number;
}

const StandardNetworkBlockSummary = ({ isDesktop, blockHeight }: BlockSummaryProps) => {
  const { data, isFetched } = useMappedApiBlock(String(blockHeight));
  const { getUrlWithNetwork } = useNetwork();

  const proposerDisplayName = React.useMemo(() => {
    if (!data.proposerAddress) return "-";

    if (data.proposerRaw) {
      return `${data.proposerAddress} (${data.proposerRaw})`;
    }

    return `${data.proposerAddress}`;
  }, [data.proposerAddress]);

  const displayBlockHeight = React.useMemo(() => {
    return formatDisplayBlockHeight(data.blockHeightStr);
  }, [data.blockHeightStr]);

  const blockHash = data.hash ? toDisplayHash(data.hash) : "";

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <DLWrap desktop={isDesktop}>
        <dt>Block Hash</dt>
        <dd>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {blockHash || "-"}
            </Text>
            {blockHash && (
              <Tooltip content="Copied!" trigger="click" copyText={blockHash}>
                <StyledIconCopy className="svg-icon" />
              </Tooltip>
            )}
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Block Hash (base64)</dt>
        <dd>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {data.hashBase64 || "-"}
            </Text>
            {data.hashBase64 && (
              <Tooltip content="Copied!" trigger="click" copyText={data.hashBase64}>
                <StyledIconCopy className="svg-icon" />
              </Tooltip>
            )}
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Timestamp</dt>
        <dd>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {data.timeStamp.time}
            </Text>
            <DateDiffText>{data.timeStamp.passedTime}</DateDiffText>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Network</dt>
        <dd>
          <Badge>{data.network || "-"}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Height</dt>
        <dd>
          <Badge>{displayBlockHeight}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Transactions</dt>
        <dd>
          <Badge>{data.numberOfTransactions}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Gas&nbsp;(Used/Wanted)</dt>
        <dd>
          <Badge>{data.gas}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} multipleBadgeGap="24px">
        <dt>Proposer</dt>
        <dd>
          <Badge>
            <FitContentA>
              <Link href={getUrlWithNetwork(`/account/${data.proposerAddress}`)} passHref>
                <Text type="p4" color="blue" className="ellipsis">
                  {proposerDisplayName}
                </Text>
              </Link>
            </FitContentA>
          </Badge>
        </dd>
      </DLWrap>
    </DataSection>
  );
};

export default StandardNetworkBlockSummary;
