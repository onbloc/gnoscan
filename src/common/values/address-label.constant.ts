import { ValuesType } from "utility-types";

// Mirrors the backend's enum.AddressLabelType (pkg/enum/address_label.go).
export const ADDRESS_LABEL_TYPE = {
  REALM: "realm",
  EXCHANGE: "exchange",
  ENTITY: "entity",
} as const;

export type ADDRESS_LABEL_TYPE = ValuesType<typeof ADDRESS_LABEL_TYPE>;

export const ADDRESS_NAME_TAG = {
  TREASURY: "Treasury",
  INVESTORS: "Investors",
  COMPANY_TEAM: "Company/Team",
  CEX: "Exchange (CEX)",
  DEX: "Exchange (DEX)",
} as const;

// Curated mainnet name tags, keyed by address. Display names themselves come from the backend label.
export const MAINNET_ADDRESS_NAME_TAGS: Readonly<Record<string, string>> = {
  g1shmvjxkvx9kgnrta5rzwcpdqszy4pkfvv9qjz9: ADDRESS_NAME_TAG.TREASURY, // Core Treasury
  g1ugke9x9ylrlex0lxcgw7eu0mdftvcrgglru0l0: ADDRESS_NAME_TAG.TREASURY, // Ecosystem Treasury
  g1kj5ag4xdjws00rfzg49x6lljv34pty5uchcq2p: ADDRESS_NAME_TAG.TREASURY, // Validator Treasury
  g1j3et7juxr3npgdll3lml3mpv0y6m49rztjnf76: ADDRESS_NAME_TAG.INVESTORS, // Investors_unlocked
  g1x7tm26g9wj84cmg3cs74uwf3g9lqj4mjp6gax3: ADDRESS_NAME_TAG.INVESTORS, // Investors_locked
  g1pku9u3jwr8k8vjpfypqzd0uhmrwr35zk0f8u7p: ADDRESS_NAME_TAG.COMPANY_TEAM, // NewTendermint LLC
  g1y7h659patawdy99mlufj9lp3t9cwpt8fq852zq: ADDRESS_NAME_TAG.TREASURY, // Ecosystem #1
  g1plxd74hnxyjvh309nfcndp53ypvv93yp5rd7dk: ADDRESS_NAME_TAG.TREASURY, // Ecosystem #2
  g1kg87wr06tmw7uvlyk4yrj3r2pzmt2j83d47nu7: ADDRESS_NAME_TAG.COMPANY_TEAM, // DevOps
  g1ayzkvh7dlmkqet9ccyfgkxmeg36f2sjj82w7sm: ADDRESS_NAME_TAG.CEX, // KuCoin #1
  g1ct00m8t88chjcfaysafhsk9fdz43qyr9d2tccd: ADDRESS_NAME_TAG.CEX, // KuCoin #2
  g1arpgqtq9q3emx6mfhuz7xuwd6qptcwynedzlk2: ADDRESS_NAME_TAG.CEX, // KuCoin #3
  g15zetuthld0er5jrm3xtx3u4ucssjvd3ylmvce3: ADDRESS_NAME_TAG.CEX, // Kraken #1
  g138f8fawcn5xuurg4x9v7a3n3zcwwhl3ekdcy7w: ADDRESS_NAME_TAG.CEX, // Kraken #2
  g1kyav8rjkcxfmjrw9n8end8emazcxhhtauhx8eu: ADDRESS_NAME_TAG.CEX, // Kraken #3
};

// Realm labels under this path get the DEX name tag on mainnet.
export const MAINNET_DEX_REALM_PREFIX = "gno.land/r/gnoswap/";
