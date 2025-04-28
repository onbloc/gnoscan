/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { TxFee, TxSignature } from "@gnolang/tm2-js-client";

import { ValidatorInfo } from "@/repositories/chain-repository";

import DataSection from "../../details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockSummaryProps {
  isDesktop: boolean;
  isFetched: boolean;
  validatorInfos: ValidatorInfo[] | null | undefined;
  block: {
    timeStamp: {
      time: string;
      passedTime: string | undefined;
    };
    network: string;
    blockHeight: number | null;
    blockHeightStr: string | undefined;
    transactions:
      | {
          hash: string;
          messages: any[];
          fee?: TxFee;
          signatures: TxSignature[];
          memo: string;
        }[]
      | undefined;
    numberOfTransactions: string;
    gas: string;
    proposerAddress: string;
    hasPreviousBlock: boolean;
    hasNextBlock: boolean;
  };

  getUrlWithNetwork: (uri: string) => string;
}

const BlockSummary = ({ block, validatorInfos, isDesktop, isFetched, getUrlWithNetwork }: BlockSummaryProps) => {
  const proposerDisplayName = React.useMemo(() => {
    const validatorInfo = validatorInfos?.find(info => info.address === block.proposerAddress);
    if (!validatorInfo) {
      return block.proposerAddress;
    }

    return `${block.proposerAddress} (${validatorInfo.name})`;
  }, [block.proposerAddress, validatorInfos]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <DLWrap desktop={isDesktop}>
        <dt>Timestamp</dt>
        <dd>
          <Badge>
            <Text type="p4" color="inherit" className="ellipsis">
              {block.timeStamp.time}
            </Text>
            <DateDiffText>{block.timeStamp.passedTime}</DateDiffText>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Network</dt>
        <dd>
          <Badge>{block.network}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Height</dt>
        <dd>
          <Badge>{block.blockHeightStr}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Transactions</dt>
        <dd>
          <Badge>{block.numberOfTransactions}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Gas&nbsp;(Used/Wanted)</dt>
        <dd>
          <Badge>{block?.gas}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} multipleBadgeGap="24px">
        <dt>Proposer</dt>
        <dd>
          <Badge>
            <FitContentA>
              <Link href={getUrlWithNetwork(`/account/${block?.proposerAddress}`)} passHref>
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

export default BlockSummary;
