import React from "react";
import Link from "next/link";

import DataSection from "../../details-data-section";
import { Field } from "@/components/ui/detail-field";
import { DateDiffText, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useMappedApiBlock } from "@/common/services/block/use-mapped-api-block";
import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";
import { toDisplayHash } from "@/common/utils/transaction.utility";

interface BlockSummaryProps {
  blockHeight: number;
}

const StandardNetworkBlockSummary = ({ blockHeight }: BlockSummaryProps) => {
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
      <Field label="Block Hash">
        <Badge>
          <Text type="p4" color="inherit" className="ellipsis">
            {blockHash || "-"}
          </Text>
          {blockHash && <CopyTooltip copyText={blockHash} />}
        </Badge>
      </Field>
      <Field label="Block Hash (base64)">
        <Badge>
          <Text type="p4" color="inherit" className="ellipsis">
            {data.hashBase64 || "-"}
          </Text>
          {data.hashBase64 && <CopyTooltip copyText={data.hashBase64} />}
        </Badge>
      </Field>
      <Field label="Timestamp">
        <Badge>
          <Text type="p4" color="inherit" className="ellipsis">
            {data.timeStamp.time}
          </Text>
          <DateDiffText>{data.timeStamp.passedTime}</DateDiffText>
        </Badge>
      </Field>
      <Field label="Network">
        <Badge>{data.network || "-"}</Badge>
      </Field>
      <Field label="Height">
        <Badge>{displayBlockHeight}</Badge>
      </Field>
      <Field label="Transactions">
        <Badge>{data.numberOfTransactions}</Badge>
      </Field>
      <Field label="Gas&nbsp;(Used/Wanted)">
        <Badge>{data.gas}</Badge>
      </Field>
      <Field label="Proposer" multipleBadgeGap="24px">
        <Badge>
          <FitContentSpan>
            <Link href={getUrlWithNetwork(`/account/${data.proposerAddress}`)} passHref>
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

export default StandardNetworkBlockSummary;
