import React from "react";
import styled from "styled-components";
import IconSuccess from "@/assets/svgs/icon-status-success.svg";
import IconFail from "@/assets/svgs/icon-status-fail.svg";
import { StatusKeyType } from "@/common/utils";
import { textEllipsis } from "@/common/utils/string-util";
import { toDisplayHash } from "@/common/utils/transaction.utility";
import { useNetwork } from "@/common/hooks/use-network";

interface Props {
  txHash: string;
  status: StatusKeyType;
}

export const TxHash = ({ txHash, status }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const displayHash = toDisplayHash(txHash ?? "");

  return (
    <TxHashWrapper>
      <a className="ellipsis" href={getUrlWithNetwork(`/transactions/details?txhash=${displayHash}`)}>
        {textEllipsis(displayHash, 8)}
      </a>
      <span className="status">{status === "failure" ? <IconFail /> : <IconSuccess />}</span>
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
