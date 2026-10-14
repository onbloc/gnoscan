import React from "react";

import { useGetNftCollection } from "@/common/react-query/token/api";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

interface Props {
  tokenKey: string;
}

export const LazyNftStandard = ({ tokenKey }: Props) => {
  const { data, isFetched } = useGetNftCollection(tokenKey);

  if (!isFetched) return <SkeletonBar height="20px" />;

  // Match Summary: the API's creation-event emitter, with only the gno.land/ prefix omitted.
  const standardPackage = data?.data.standardPackage;
  return <span title={standardPackage ?? undefined}>{standardPackage?.replace(/^gno\.land\//, "") || "-"}</span>;
};
