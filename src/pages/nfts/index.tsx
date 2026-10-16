import React from "react";

import NftCollectionsLayout from "@/layouts/nft-collections/NftCollectionsLayout";
import NftCollectionListContainer from "@/containers/nft-collections/nft-collection-list-container/NftCollectionListContainer";

export default function Page() {
  return (
    <>
      <NftCollectionsLayout nftCollectionList={<NftCollectionListContainer />} />
    </>
  );
}
