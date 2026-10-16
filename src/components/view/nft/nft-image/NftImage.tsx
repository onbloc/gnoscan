import React from "react";

import IconTableLoading from "@/assets/svgs/icon-table-loading.svg";
import * as S from "./NftImage.styles";

interface NftImageProps {
  src?: string | null;
  // Pending URI/metadata lookup; the image's own load/error lifecycle is tracked separately.
  isLoading?: boolean;
  alt: string;
  // CSS aspect-ratio of the artwork frame
  aspectRatio?: string;
  className?: string;
}

// Key each image request so obsolete media events cannot change the current artwork.
const NftImage = (props: NftImageProps) => <ArtworkFrame key={props.src || ""} {...props} />;

const ArtworkFrame = ({ src, isLoading = false, alt, aspectRatio = "1 / 1", className }: NftImageProps) => {
  const [status, setStatus] = React.useState<"pending" | "loaded" | "failed">("pending");
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const attachImage = React.useCallback((image: HTMLImageElement | null) => {
    imageRef.current = image;
    // Cached images can finish before React attaches event handlers.
    if (image?.complete) setStatus(image.naturalWidth > 0 ? "loaded" : "failed");
  }, []);
  const showImage = !!src && status === "loaded";
  const loading = !showImage && status !== "failed" && (!!src || isLoading);
  const placeholder = !showImage && !loading;

  return (
    <S.Frame className={className} isPlaceholder={placeholder} style={{ aspectRatio }}>
      {src && status !== "failed" && (
        <S.Image
          ref={attachImage}
          src={src}
          alt={alt}
          loading="lazy"
          style={{ visibility: showImage ? "visible" : "hidden" }}
          onLoad={event => {
            if (event.currentTarget === imageRef.current) setStatus("loaded");
          }}
          onError={event => {
            if (event.currentTarget === imageRef.current) setStatus("failed");
          }}
        />
      )}
      {loading && (
        <S.Loading role="status" aria-label="Loading NFT artwork">
          {/* Preserve scaling when SVGO strips the asset's viewBox. */}
          <IconTableLoading viewBox="0 0 100 101" aria-hidden="true" />
        </S.Loading>
      )}
      {placeholder && <span className="nft-default-icon" aria-label={alt} role="img" />}
    </S.Frame>
  );
};

export default NftImage;
