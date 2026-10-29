import React from "react";

import { useGetNftCollectionMetaQuery } from "@/common/react-query/meta";

/** Resolves a collection name from gno-token-resource first, as token names are, falling back to the on-chain name. */
export const useNftCollectionName = () => {
  const { data: collectionMetas = [] } = useGetNftCollectionMetaQuery();

  return React.useCallback(
    (packagePath: string | undefined, name: string) =>
      collectionMetas.find(meta => meta.pkg_path === packagePath)?.name || name,
    [collectionMetas],
  );
};
