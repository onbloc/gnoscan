import Link from "next/link";
import styled from "styled-components";

import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { useNetwork } from "@/common/hooks/use-network";
import Text from "@/components/ui/text";

interface Props {
  token: string | undefined;
  imagePath: string | undefined;
  name: string | undefined;
  symbol: string;
  pkgPath: string;
  tokenId: string;
}

export const StandardNetworkTokenTitle = ({ name, symbol, pkgPath, tokenId, imagePath }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const tokenLinkId = tokenId || pkgPath;

  return (
    <Link href={getUrlWithNetwork(`/tokens/${tokenLinkId}`)}>
      <TokenTitleWrapper>
        {imagePath ? (
          <img className="token" src={imagePath} alt="token logo" />
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
