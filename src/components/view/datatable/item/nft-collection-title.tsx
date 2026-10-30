import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { useNftCollectionName } from "@/common/hooks/nft/use-nft-collection-name";
import { useGetNftCollectionMetaQuery } from "@/common/react-query/meta";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
import Text from "@/components/ui/text";
import IconNftCollectionDefault from "@/assets/svgs/icon-nft-collection-default.svg";

interface Props {
  tokenId: string;
  name: string;
  packagePath: string;
}

/** The collection's token resource logo, or the default collection icon. */
export const NftCollectionLogo = ({ packagePath, className }: { packagePath: string; className?: string }) => {
  const { data: collectionMetas = [] } = useGetNftCollectionMetaQuery();
  const image = collectionMetas.find(meta => meta.pkg_path === packagePath)?.image;
  const imageUrl = image ? `${GNO_TOKEN_RESOURCE_BASE_URI}${image}` : undefined;
  // A logo that fails to load falls back to the default icon instead of a broken image.
  const [failedImageUrl, setFailedImageUrl] = React.useState<string>();

  return imageUrl && imageUrl !== failedImageUrl ? (
    <img className={className} src={imageUrl} alt="" onError={() => setFailedImageUrl(imageUrl)} />
  ) : (
    // Preserve scaling when SVGO strips the asset's viewBox.
    <IconNftCollectionDefault className={className} viewBox="0 0 24 24" aria-hidden="true" />
  );
};

export const NftCollectionTitle = ({ tokenId, name, packagePath }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const collectionName = useNftCollectionName();

  return (
    <Link href={getUrlWithNetwork(`/tokens/${tokenId}`)}>
      <Wrapper>
        <NftCollectionLogo className="collection-icon" packagePath={packagePath} />
        <Text type="p4" color="blue">
          {collectionName(packagePath, name)}
        </Text>
      </Wrapper>
    </Link>
  );
};

const Wrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    .collection-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      object-fit: contain;
    }
  }
`;
