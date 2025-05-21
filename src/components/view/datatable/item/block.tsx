import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { GNO_BLOCK_CONSTANTS } from "@/common/values/gno.constant";

interface Props {
  height: string | number | undefined;
}

export const Block = ({ height }: Props) => {
  const { getUrlWithNetwork } = useNetwork();

  if (height == null) {
    return <span>-</span>;
  }

  const numHeight = Number(height);

  if (isNaN(numHeight)) {
    return <span>Invalid height</span>;
  }

  const displayHeight = numHeight === 0 ? GNO_BLOCK_CONSTANTS.GENESIS : height;

  return <a href={getUrlWithNetwork(`/block/${height}`)}>{displayHeight}</a>;
};
