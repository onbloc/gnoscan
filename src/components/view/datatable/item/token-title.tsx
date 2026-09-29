import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import Text from "@/components/ui/text";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";

interface Props {
  token: string | undefined;
  imagePath: string | undefined;
  name: string | undefined;
  symbol: string;
  pkgPath: string;
}

export const TokenTitle = ({ name, symbol, pkgPath, imagePath }: Props) => {
  const { isFetchedGRC20Tokens, getTokenImage } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();

  const imageUrl = useMemo(() => {
    if (!imagePath || !isFetchedGRC20Tokens) {
      return null;
    }
    return getTokenImage(imagePath);
  }, [imagePath, isFetchedGRC20Tokens, getTokenImage]);

  return (
    <Link href={getUrlWithNetwork(`/tokens/${pkgPath}`)}>
      <TokenTitleWrapper>
        {imageUrl ? (
          <img className="token" src={imageUrl} alt="token logo" />
        ) : (
          <div className="unknown-token">
            <UnknownToken width="20" height="20" />
          </div>
        )}

        <Text type="p4">{`${name} (${symbol})`}</Text>
      </TokenTitleWrapper>
    </Link>
  );
};

const TokenTitleWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.blue};
    cursor: pointer;

    .token,
    .unknown-token {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
`;
