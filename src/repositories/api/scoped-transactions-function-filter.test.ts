import { NetworkClient } from "@/common/clients/network-client";
import { ApiAccountRepositoryImpl } from "./account/api-account-repository-impl";
import { ApiBlockRepositoryImpl } from "./block/api-block-repository-impl";
import { ApiRealmRepositoryImpl } from "./realm/api-realm-repository-impl";
import { ApiTokenRepositoryImpl } from "./token/api-token-repository-impl";

const get = jest.fn().mockResolvedValue({ data: { data: {} } });
const client = { get } as unknown as NetworkClient;

const account = new ApiAccountRepositoryImpl(client);
const realm = new ApiRealmRepositoryImpl(client, null);
const token = new ApiTokenRepositoryImpl(client);
const block = new ApiBlockRepositoryImpl(client);

beforeEach(() => get.mockClear());

// Each scoped list of a detail page: its request and the URL it must send without and with the filter.
const lists = [
  {
    name: "account direct transactions",
    request: (filter: object) => account.getAccountDirectTransactions({ address: "g1abc", page: 2, ...filter }),
    url: "accounts/g1abc/direct-transactions",
  },
  {
    name: "realm direct transactions",
    request: (filter: object) => realm.getRealmDirectTransactions({ path: "gno.land/r/demo/foo", page: 2, ...filter }),
    url: "/realms/gno.land%2Fr%2Fdemo%2Ffoo/direct-transactions",
  },
  {
    name: "token and NFT collection transactions",
    request: (filter: object) => token.getTokenMetaTransactions({ path: "gno.land/r/demo/foo", page: 2, ...filter }),
    url: "token-meta/gno.land%2Fr%2Fdemo%2Ffoo/transactions",
  },
  {
    name: "block transactions",
    request: (filter: object) => block.getBlockTransactions({ blockHeight: "100", page: 2, ...filter }),
    url: "blocks/100/transactions",
  },
];

describe.each(lists)("$name", ({ request, url }) => {
  it("keeps the request as it was without a filter", async () => {
    await request({});
    expect(get).toHaveBeenCalledWith({ url: `${url}?page=2` });

    get.mockClear();
    await request({ function: [], excludeFunction: [] });
    expect(get).toHaveBeenCalledWith({ url: `${url}?page=2` });
  });

  it("sends one encoded function and excludeFunction parameter per label", async () => {
    await request({ function: ["Mint", "a&b c"], excludeFunction: ["Vote"] });

    expect(get).toHaveBeenCalledWith({
      url: `${url}?page=2&function=Mint&function=a%26b+c&excludeFunction=Vote`,
    });
  });
});
