import React from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";

interface Props {
  height: string | number | undefined;
}

export const Block = ({ height }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return height ? <Link href={getUrlWithNetwork(`/block/${height}`)}>{height}</Link> : <span>-</span>;
};
