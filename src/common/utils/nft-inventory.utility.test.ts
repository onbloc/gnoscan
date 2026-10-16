import { remapNftInventoryPage } from "./nft-inventory.utility";

it.each([
  [2, 20, 22, 20, 1],
  [2, 20, 22, 39, 2],
  [2, 22, 20, 43, 3],
])("keeps selected NFT index %s within the resized page", (page, previousSize, nextSize, anchorIndex, expected) => {
  expect(remapNftInventoryPage(page, previousSize, nextSize, anchorIndex)).toBe(expected);
});

it("anchors page-size changes to the first visible NFT when selection is on another page", () => {
  expect(remapNftInventoryPage(3, 20, 22)).toBe(2);
  expect(remapNftInventoryPage(3, 22, 20)).toBe(3);
});
