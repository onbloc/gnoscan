// Metadata URLs are untrusted. Only image and web protocols are rendered.
export function nftMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${value.slice(7).replace(/^ipfs\//, "")}`;
  }
  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value)) return value;
  return undefined;
}

export function nftArtwork(metadata?: { image?: string; imageData?: string } | null): string | undefined {
  if (metadata?.imageData) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(metadata.imageData)}`;
  }
  return nftMediaUrl(metadata?.image);
}
