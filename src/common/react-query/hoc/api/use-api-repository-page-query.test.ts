import { useApiRepositoryPageQuery } from "./use-api-repository-page-query";
import { useApiRepositoryQuery } from "./use-api-repository-query";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";

jest.mock("./use-api-repository-query", () => ({ useApiRepositoryQuery: jest.fn() }));

const mockQuery = useApiRepositoryQuery as jest.Mock;
const repository = {};

const usePageQuery = (params: { page: number; limit?: number }, options?: object) => {
  const fetchPage = jest.fn().mockResolvedValue("response");
  useApiRepositoryPageQuery(["key"], params, repository, API_REPOSITORY_KEY.BLOCK_REPOSITORY, fetchPage, options);
  const [queryKey, , , queryFn, queryOptions] = mockQuery.mock.calls[0];
  return { queryKey, queryFn, queryOptions, fetchPage };
};

beforeEach(() => mockQuery.mockReset());

it("requests the list page size unless the caller asks for another", async () => {
  const { queryFn, fetchPage } = usePageQuery({ page: 2 });
  await queryFn(repository);
  expect(fetchPage).toHaveBeenCalledWith(repository, { page: 2, limit: DEFAULT_LIST_ITEMS_SIZE });

  mockQuery.mockReset();
  const custom = usePageQuery({ page: 2, limit: 10 });
  await custom.queryFn(repository);
  expect(custom.fetchPage).toHaveBeenCalledWith(repository, { page: 2, limit: 10 });
});

it("keys each page apart", () => {
  expect(usePageQuery({ page: 1 }).queryKey).toEqual(["key", { page: 1 }]);
});

it("keeps the previous page by default, which the caller can turn off", () => {
  expect(usePageQuery({ page: 1 }).queryOptions.keepPreviousData).toBe(true);

  mockQuery.mockReset();
  expect(usePageQuery({ page: 1 }, { keepPreviousData: false, staleTime: 5 }).queryOptions).toEqual({
    keepPreviousData: false,
    staleTime: 5,
  });
});
