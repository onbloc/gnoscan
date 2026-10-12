import React from "react";

import IconNftDefault from "@/assets/svgs/icon-nft-default.svg";
import * as S from "./NftImage.styles";

interface NftImageProps {
  src?: string | null;
  alt: string;
  // CSS aspect-ratio of the artwork frame
  aspectRatio?: string;
  className?: string;
}

// NFT artwork; the default placeholder covers a missing or unloadable image.
const NftImage = ({ src, alt, aspectRatio = "1 / 1", className }: NftImageProps) => {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  return (
    <S.Frame className={className} isPlaceholder={!showImage} style={{ aspectRatio }}>
      {showImage ? (
        <S.Image src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />
      ) : (
        <IconNftDefault className="nft-default-icon" aria-label={alt} role="img" />
      )}
    </S.Frame>
  );
};

export default NftImage;
