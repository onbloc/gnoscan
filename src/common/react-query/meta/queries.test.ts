import { fetchTokenMeta } from "./queries";

jest.mock("@/common/hooks/provider/use-service-provider", () => ({}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({}));

const mockFetch = (response: Partial<Response>) => {
  global.fetch = jest.fn().mockResolvedValue(response) as jest.Mock;
};

describe("fetchTokenMeta", () => {
  it("keys each entry by denom or pkg_path", async () => {
    mockFetch({ ok: true, json: async () => [{ denom: "ugnot" }, { pkg_path: "gno.land/r/gnoswap/gns" }] });
    const metas = await fetchTokenMeta("https://example.com/list.json");
    expect(metas.map(meta => meta.id)).toEqual(["ugnot", "gno.land/r/gnoswap/gns"]);
  });

  it("rejects when the list is missing, so a failed load is not read as an empty list", async () => {
    mockFetch({ ok: false, status: 404 });
    await expect(fetchTokenMeta("https://example.com/missing.json")).rejects.toThrow("404");
  });

  it("returns an empty list without a network", async () => {
    await expect(fetchTokenMeta("")).resolves.toEqual([]);
  });
});
