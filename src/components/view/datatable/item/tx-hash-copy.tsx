import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { textEllipsis } from "@/common/utils/string-util";
import { useNetwork } from "@/common/hooks/use-network";
import { TX_HASH_ELLIPSIS_LENGTH } from "@/common/values/number.constant";

import Tooltip from "@/components/ui/tooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";

interface Props {
  txHash: string;
}

export const TxHashCopy = ({ txHash }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return (
    <TxHashWrapper>
      <Link className="ellipsis" href={getUrlWithNetwork(`/transactions/details?txhash=${txHash}`)}>
        {textEllipsis(txHash ?? "", TX_HASH_ELLIPSIS_LENGTH)}
        <Tooltip className="path-copy-tooltip" content="Copied!" trigger="click" copyText={txHash} width={85}>
          <IconCopy className="svg-icon" />
        </Tooltip>
      </Link>
    </TxHashWrapper>
  );
};

const TxHashWrapper = styled.div`
  & {
    display: flex;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    a {
      width: 100%;
    }

    .status {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 5px;
    }
  }
`;
