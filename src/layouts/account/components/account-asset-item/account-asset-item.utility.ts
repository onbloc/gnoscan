export type GetTokenImage = (tokenId: string) => string | undefined;

export function resolveAccountAssetLogoUrl(
  logoUrl: string | null | undefined,
  tokenId: string,
  getTokenImage: GetTokenImage,
): string {
  return logoUrl || getTokenImage(tokenId) || "";
}
