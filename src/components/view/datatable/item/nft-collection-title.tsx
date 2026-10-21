import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetNftCollectionMetaQuery } from "@/common/react-query/meta";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
import Text from "@/components/ui/text";
import IconNftCollectionDefault from "@/assets/svgs/icon-nft-collection-default.svg";

interface Props {
  tokenId: string;
  name: string;
  packagePath: string;
}

export const NftCollectionTitle = ({ tokenId, name, packagePath }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const { data: collectionMetas = [] } = useGetNftCollectionMetaQuery();
  const image = collectionMetas.find(meta => meta.pkg_path === packagePath)?.image;

  return (
    <Link href={getUrlWithNetwork(`/tokens/${tokenId}`)}>
      <Wrapper>
        {image ? (
          <img className="collection-icon" src={`${GNO_TOKEN_RESOURCE_BASE_URI}${image}`} alt="" />
        ) : (
          // Preserve scaling when SVGO strips the asset's viewBox.
          <IconNftCollectionDefault className="collection-icon" viewBox="0 0 24 24" aria-hidden="true" />
        )}
        <Text type="p4" color="blue">
          {name}
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
    }
  }
`;
