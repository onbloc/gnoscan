import { ApiSearchRepository } from "@/repositories/api/search/api-search-repository";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";

import { getSearchSubmitUrl } from "./search-submit-url";

const REALM_ADDRESS = "g1m5920e2mxfawvp8tljyga94s2jtpj69rxf8y4h"; // bech32 address derived from "gno.land/r/demo/foo"
const ACCOUNT_ADDRESS = "g1qyqszqgpqyqszqgpqyqszqgpqyqszqgpp0aavc";

const getUrlWithNetwork = (uri: string) => uri;

function makeSearchRepository(getSearch: ApiSearchRepository["getSearch"]): ApiSearchRepository {
  return { getSearch, getSearchAutocomplete: jest.fn() };
}

describe("getSearchSubmitUrl", () => {
  test("standard network + realm package address -> realm details page", async () => {
    const apiSearchRepository = makeSearchRepository(async () => [
      { type: SEARCH_RESULT_TYPE.REALM, title: "gno.land/r/demo/foo", description: "", link: "" },
    ]);

    const url = await getSearchSubmitUrl(REALM_ADDRESS, getUrlWithNetwork, false, apiSearchRepository);

    expect(url).toBe("/realms/details?path=gno.land/r/demo/foo");
  });

  test("standard network + regular account address -> account page", async () => {
    const apiSearchRepository = makeSearchRepository(async () => [
      { type: SEARCH_RESULT_TYPE.ACCOUNT, title: ACCOUNT_ADDRESS, description: "", link: "" },
    ]);

    const url = await getSearchSubmitUrl(ACCOUNT_ADDRESS, getUrlWithNetwork, false, apiSearchRepository);

    expect(url).toBe(`/account/${ACCOUNT_ADDRESS}`);
  });

  test("standard network + search API failure -> falls back to local heuristic", async () => {
    const apiSearchRepository = makeSearchRepository(async () => {
      throw new Error("network error");
    });

    const url = await getSearchSubmitUrl(REALM_ADDRESS, getUrlWithNetwork, false, apiSearchRepository);

    expect(url).toBe(`/account/${REALM_ADDRESS}`);
  });

  test("custom network -> never calls the backend search API", async () => {
    const getSearch = jest.fn();
    const apiSearchRepository = makeSearchRepository(getSearch);

    const url = await getSearchSubmitUrl(REALM_ADDRESS, getUrlWithNetwork, true, apiSearchRepository);

    expect(getSearch).not.toHaveBeenCalled();
    expect(url).toBe(`/account/${REALM_ADDRESS}`);
  });
});
