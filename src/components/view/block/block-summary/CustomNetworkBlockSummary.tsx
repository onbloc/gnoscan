/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { TxFee, TxSignature } from "@gnolang/tm2-js-client";

import { ValidatorInfo } from "@/repositories/chain-repository";
import { useBlock } from "@/common/hooks/blocks/use-block";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetValidatorNames } from "@/common/hooks/common/use-get-validator-names";

import DataSection from "../../details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockSummaryProps {
  isDesktop: boolean;
  blockHeight: number;
}

const CustomNetworkBlockSummary = ({ isDesktop, blockHeight }: BlockSummaryProps) => {
  const { block, isFetched } = useBlock(blockHeight);
  const { getUrlWithNetwork } = useNetwork();
  const { validatorInfos } = useGetValidatorNames();

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

export default CustomNetworkBlockSummary;
