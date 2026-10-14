import React from "react";

import { useGetNftCollection } from "@/common/react-query/token/api";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { RealmPackage } from "./realm-package";

interface Props {
  tokenKey: string;
}

export const LazyNftStandard = ({ tokenKey }: Props) => {
  const { data, isFetched } = useGetNftCollection(tokenKey);

  if (!isFetched) return <SkeletonBar height="20px" />;

  // Link to the API's creation-event emitter, not the NFT collection's own realm.
  const standardPackage = data?.data.standardPackage;
  return standardPackage ? <RealmPackage packagePath={standardPackage} maxWidth={147} /> : <span>-</span>;
};
