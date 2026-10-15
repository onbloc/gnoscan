import { GNOSWAP_STAKER_ADDRESS } from "../values/constant-value";
import { isStakedNft } from "./nft-staking.utility";

describe("isStakedNft", () => {
  it("is staked when the gnoswap position NFT is held by the staker realm", () => {
    expect(isStakedNft({ packagePath: "gno.land/r/gnoswap/gnft", ownerAddress: GNOSWAP_STAKER_ADDRESS })).toBe(true);
  });

  it("is not staked when a user holds the gnoswap position NFT", () => {
    expect(isStakedNft({ packagePath: "gno.land/r/gnoswap/gnft", ownerAddress: "g1user" })).toBe(false);
  });

  it("ignores other collections held by the staker address", () => {
    expect(isStakedNft({ packagePath: "gno.land/r/example/nfts", ownerAddress: GNOSWAP_STAKER_ADDRESS })).toBe(false);
  });
});
