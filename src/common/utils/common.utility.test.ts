import { isApiNotFound } from "./common.utility";

describe("isApiNotFound", () => {
  it("waits until the query has settled", () => {
    expect(isApiNotFound({ isFetched: false, isError: false, data: undefined })).toBe(false);
  });

  it("is not found when the lookup fails before any data arrives", () => {
    expect(isApiNotFound({ isFetched: true, isError: true, data: undefined })).toBe(true);
  });

  it("is not found when the API answers without the entity", () => {
    expect(isApiNotFound({ isFetched: true, isError: false, data: { data: null } })).toBe(true);
  });

  it("is found when the entity loaded", () => {
    expect(isApiNotFound({ isFetched: true, isError: false, data: { data: { path: "gno.land/r/demo" } } })).toBe(false);
  });

  // react-query keeps the cached data and sets isError when a background refetch fails.
  it("keeps a loaded page when a later refetch fails", () => {
    expect(isApiNotFound({ isFetched: true, isError: true, data: { data: { path: "gno.land/r/demo" } } })).toBe(false);
  });
});
