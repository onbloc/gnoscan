import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { toDisplayHash } from "@/common/utils/transaction.utility";

interface Props {
  hash: string | undefined;
  height: string | number | undefined;
}

export const BlockHash = ({ hash, height }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return height ? (
    <a href={getUrlWithNetwork(`/block/${height}`)}>{textEllipsis(toDisplayHash(hash ?? ""), 8)}</a>
  ) : (
    <span>-</span>
  );
};
