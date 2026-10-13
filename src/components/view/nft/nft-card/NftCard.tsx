import React from "react";

import NftImage from "../nft-image/NftImage";
import * as S from "./NftCard.styles";

// Artwork frame per size: account cards follow Figma's 250×251 frame; inventory uses 198×183.
const IMAGE_ASPECT_RATIO: Record<S.NftCardSize, string> = {
  regular: "250 / 251",
  compact: "198 / 183",
};

interface NftCardProps {
  nftId: string;
  symbol: string;
  imageUrl?: string | null;
  size?: S.NftCardSize;
  selected?: boolean;
  // Rows below the token title (e.g. collection or owner)
  children?: React.ReactNode;
}

const NftCard = ({ nftId, symbol, imageUrl, size = "regular", selected = false, children }: NftCardProps) => {
  const title = `Token #${nftId}`;
  const isCompact = size === "compact";

  return (
    <S.Card size={size} selected={selected}>
      <NftImage src={imageUrl} alt={title} aspectRatio={IMAGE_ASPECT_RATIO[size]} />
      <S.Info size={size}>
        <S.TitleRow>
          <S.Title type="p4" desktopType={isCompact ? "p4" : "p3"} color="primary" style={{ lineHeight: "24px" }}>
            {title}
          </S.Title>
          {symbol && (
            <S.SymbolBadge type="body1" desktopType={isCompact ? "body1" : "p4"} color="primary">
              {symbol}
            </S.SymbolBadge>
          )}
        </S.TitleRow>
        {children}
      </S.Info>
    </S.Card>
  );
};

export default NftCard;
