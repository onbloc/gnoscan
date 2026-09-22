import { getSearchSubmitUrl } from "./search-submit-url";

const REALM_ADDRESS = "g1m5920e2mxfawvp8tljyga94s2jtpj69rxf8y4h"; // bech32 address derived from "gno.land/r/demo/foo"
const ACCOUNT_ADDRESS = "g1qyqszqgpqyqszqgpqyqszqgpqyqszqgpp0aavc";

const getUrlWithNetwork = (uri: string) => uri;

describe("getSearchSubmitUrl", () => {
  test("regular account address -> account page without waiting for a realm lookup", async () => {
    const url = await getSearchSubmitUrl(ACCOUNT_ADDRESS, getUrlWithNetwork);

    expect(url).toBe(`/account/${ACCOUNT_ADDRESS}`);
  });

  test("realm address -> account route for server-side realm resolution", async () => {
    const url = await getSearchSubmitUrl(REALM_ADDRESS, getUrlWithNetwork);

    expect(url).toBe(`/account/${REALM_ADDRESS}`);
  });
});
