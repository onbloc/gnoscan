import React from "react";

import * as S from "./NftImage.styles";

interface NftImageProps {
  src?: string | null;
  alt: string;
  // CSS aspect-ratio of the artwork frame
  aspectRatio?: string;
  className?: string;
}

// Fit the complete artwork without cropping; use the default placeholder for missing or unloadable images.
const NftImage = ({ src, alt, aspectRatio = "1 / 1", className }: NftImageProps) => {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  return (
    <S.Frame className={className} isPlaceholder={!showImage} style={{ aspectRatio }}>
      {showImage ? (
        <S.Image src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="nft-default-icon" aria-label={alt} role="img" />
      )}
    </S.Frame>
  );
};

export default NftImage;
