// Keep the selected NFT (or the first visible NFT) in view when the page size changes.
export function remapNftInventoryPage(
  page: number,
  previousSize: number,
  nextSize: number,
  anchorIndex?: number,
): number {
  const offset = anchorIndex ?? (page - 1) * previousSize;
  return Math.floor(offset / nextSize) + 1;
}
