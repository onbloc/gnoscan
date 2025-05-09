import React from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";

interface Props {
  hash: string | undefined;
  height: string | number | undefined;
}

export const BlockHash = ({ hash, height }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return height ? (
    <Link href={getUrlWithNetwork(`/block/${height}`)}>{textEllipsis(hash ?? "", 8)}</Link>
  ) : (
    <span>-</span>
  );
};
