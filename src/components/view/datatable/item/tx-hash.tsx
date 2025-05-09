import React from "react";
import Link from "next/link";
import styled from "styled-components";
import IconSuccess from "@/assets/svgs/icon-status-success.svg";
import IconFail from "@/assets/svgs/icon-status-fail.svg";
import { RPC_URI } from "@/common/values/constant-value";
import { StatusKeyType } from "@/common/utils";
import { textEllipsis } from "@/common/utils/string-util";
import { useNetwork } from "@/common/hooks/use-network";

interface Props {
  txHash: string;
  status: StatusKeyType;
  development?: boolean;
  height?: number;
}

export const TxHash = ({ txHash, status, development, height }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const onClickIcon = () => {
    if (!development || !height) {
      return;
    }
    window.open(`${RPC_URI}/block_results?height=${height}`);
  };

  return (
    <TxHashWrapper>
      <Link className="ellipsis" href={getUrlWithNetwork(`/transactions/details?txhash=${txHash}`)}>
        {textEllipsis(txHash ?? "", 8)}
      </Link>
      <span className="status" onClick={onClickIcon}>
        {status === "failure" ? <IconFail /> : <IconSuccess />}
      </span>
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
