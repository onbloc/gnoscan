import { makeNftTokenHash, parseNftTokenHash } from "./nft-token-hash.utility";

it("round-trips an NFT id through the collection-page hash", () => {
  expect(makeNftTokenHash("1011")).toBe("#inventory&tokenId=1011");
  expect(parseNftTokenHash(makeNftTokenHash("a b/1"))).toBe("a b/1");
});

it("reads no token from a plain tab hash or an empty token id", () => {
  expect(parseNftTokenHash("#inventory")).toBeNull();
  expect(parseNftTokenHash("#inventory&tokenId=")).toBeNull();
  expect(parseNftTokenHash("")).toBeNull();
});
