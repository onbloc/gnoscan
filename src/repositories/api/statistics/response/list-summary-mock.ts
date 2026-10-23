import {
  GetSummaryNftCollectionsResponse,
  GetSummaryRealmsResponse,
  GetSummaryTokensResponse,
} from "./get-list-summary-response";

// Sample summaries for reviewing the cards before the summary API exists. Shown only with `?summaryMock=1` in the URL.
// IDs are real mainnet tokens, collections and realms so links and artwork resolve.

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const lastSevenDays = (counts: number[]) =>
  counts.map((count, index) => ({
    date: new Date(Date.now() - (counts.length - 1 - index) * 86_400_000).toISOString().slice(0, 10),
    count,
  }));

export const MOCK_SUMMARY_TOKENS: GetSummaryTokensResponse = {
  data: {
    weeklyNewCount: 7,
    mostActive: [
      { tokenId: "gno.land/r/gnoswap/gns.GNS.0000000", deltaPct: 24 },
      { tokenId: "gno.land/r/gnoland/wugnot.wugnot.0000000", deltaPct: -8 },
      { tokenId: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble.BUBBLE.0000000", deltaPct: 41 },
    ],
    transfers: {
      deltaPct: 18,
      daily: lastSevenDays([180, 214, 150, 262, 240, 255, 356]),
      uniqueSenders24h: 92,
    },
    holders: {
      holdersTotal: 1204,
      holdersDelta7d: 37,
      fastestGrowing: {
        tokenId: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble.BUBBLE.0000000",
        symbol: "BUBBLE",
        holdersDelta7d: 22,
      },
    },
  },
};

const GUARDIANS = {
  tokenId: "gno.land/r/g1nmqhha0ua730vejxqhrelldm4pga5j5ptle5ea/guardians.GUARDIANS.0000000",
  packagePath: "gno.land/r/g1nmqhha0ua730vejxqhrelldm4pga5j5ptle5ea/guardians",
  name: "Guardians",
};
const GNFT = {
  tokenId: "gno.land/r/gnoswap/gnft.GNFT.0000000",
  packagePath: "gno.land/r/gnoswap/gnft",
  name: "GNOSWAP NFT",
};
const BAZAAR_GENS = {
  tokenId: "gno.land/r/g1n4pl5uc4yt5r96m9w6fmdznx3x0jyg8l6arhmt/bazaar/c/bazaargens.bazaargens.0000001",
  packagePath: "gno.land/r/g1n4pl5uc4yt5r96m9w6fmdznx3x0jyg8l6arhmt/bazaar/c/bazaargens",
  name: "Bazaar Gens",
};

export const MOCK_SUMMARY_NFT_COLLECTIONS: GetSummaryNftCollectionsResponse = {
  data: {
    justMinted: [
      { ...GUARDIANS, collectionName: GUARDIANS.name, nftId: "3331", mintedAt: minutesAgo(12) },
      { ...BAZAAR_GENS, collectionName: BAZAAR_GENS.name, nftId: "217", mintedAt: minutesAgo(64) },
      { ...GNFT, collectionName: GNFT.name, nftId: "1252", mintedAt: minutesAgo(190) },
    ],
    mintsToday: 48,
    rising: [
      { ...GUARDIANS, mints24h: 31, newHolders24h: 12, transfers24h: 18 },
      { ...GNFT, mints24h: 9, newHolders24h: 0, transfers24h: 37 },
      { ...BAZAAR_GENS, mints24h: 4, newHolders24h: 3, transfers24h: 2 },
    ],
    activity: {
      events24h: 111,
      deltaPct: 22,
      transfers24h: 63,
      mints24h: 48,
      daily: lastSevenDays([40, 44, 30, 52, 46, 50, 63]).map(({ date, count }, index) => ({
        date,
        transfers: count,
        mints: [12, 10, 8, 20, 16, 15, 48][index],
      })),
    },
    collectors: {
      holdersTotal: 721,
      holdersDelta7d: 15,
      topCollector: { address: "g1a72vne647vcw9uv0gy7wn8sw8ffc66agl4jdr3", nftCount: 142 },
      avgPerWallet: 7.1,
    },
  },
};

export const MOCK_SUMMARY_REALMS: GetSummaryRealmsResponse = {
  data: {
    builders: [
      {
        address: "g1q5tjjv3kkslzwf2na9y9wk7e5a8ugph8xfsk04",
        namespace: "gno.land/r/gnoswap",
        deploys7d: 4,
        deploysPrev7d: 2,
      },
      {
        address: "g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr",
        namespace: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr",
        deploys7d: 3,
        deploysPrev7d: 0,
      },
      {
        address: "g1nmqhha0ua730vejxqhrelldm4pga5j5ptle5ea",
        namespace: "gno.land/r/g1nmqhha0ua730vejxqhrelldm4pga5j5ptle5ea",
        deploys7d: 2,
        deploysPrev7d: 1,
      },
    ],
    publishers7d: 14,
    mostCalled: [
      { path: "gno.land/r/gnoswap/router", calls24h: 1204, deltaPct: 12, uniqueCallers24h: 212 },
      { path: "gno.land/r/gnoland/wugnot", calls24h: 842, deltaPct: -3, uniqueCallers24h: 148 },
      { path: "gno.land/r/gnoswap/staker", calls24h: 611, deltaPct: 28, uniqueCallers24h: 96 },
    ],
    calls: {
      calls24h: 3982,
      deltaPct: 9,
      daily: lastSevenDays([2900, 2700, 2500, 2600, 3300, 3500, 3982]),
      uniqueCallers24h: 212,
      realmsTouched24h: 38,
    },
    storage: {
      locked24h: 412.3,
      released24h: 38.1,
      bytesDelta24h: 1_258_291,
      largestRealm: { path: "gno.land/r/gnoswap/staker", depositGnot: 715.6 },
    },
  },
};
