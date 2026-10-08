import React from "react";
import Link from "next/link";
import { TxFee, TxSignature } from "@gnolang/tm2-js-client";

import { ValidatorInfo } from "@/repositories/chain-repository";
import { useBlock } from "@/common/hooks/blocks/use-block";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetValidatorNames } from "@/common/hooks/common/use-get-validator-names";

import DataSection from "../../details-data-section";
import { Field } from "@/components/ui/detail-field";
import { DateDiffText, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockSummaryProps {
  blockHeight: number;
}

const CustomNetworkBlockSummary = ({ blockHeight }: BlockSummaryProps) => {
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
      <Field label="Timestamp">
        <Badge>
          <Text type="p4" color="inherit" className="ellipsis">
            {block.timeStamp.time}
          </Text>
          <DateDiffText>{block.timeStamp.passedTime}</DateDiffText>
        </Badge>
      </Field>
      <Field label="Network">
        <Badge>{block.network}</Badge>
      </Field>
      <Field label="Height">
        <Badge>{block.blockHeightStr}</Badge>
      </Field>
      <Field label="Transactions">
        <Badge>{block.numberOfTransactions}</Badge>
      </Field>
      <Field label="Gas&nbsp;(Used/Wanted)">
        <Badge>{block?.gas}</Badge>
      </Field>
      <Field label="Proposer" multipleBadgeGap="24px">
        <Badge>
          <FitContentSpan>
            <Link href={getUrlWithNetwork(`/account/${block?.proposerAddress}`)} passHref>
              <Text type="p4" color="blue" className="ellipsis">
                {proposerDisplayName}
              </Text>
            </Link>
          </FitContentSpan>
        </Badge>
      </Field>
    </DataSection>
  );
};

export default CustomNetworkBlockSummary;
