import axios from 'axios';
import {useEffect, useState} from 'react';
import {
  FetchNextPageOptions,
  InfiniteData,
  QueryObserverResult,
  useInfiniteQuery,
} from 'react-query';

interface Props {
  key: string | string[];
  uri: string;
  pageable?: boolean;
}

interface SortOption {
  field: string;
  order: 'asc' | 'desc' | 'none';
}

const usePageQuery = <T extends {[key in string]: any}>({
  key,
  uri,
  pageable = false,
}: Props): {
  data: InfiniteData<T | undefined> | undefined;
  fetchNextPage: () => Promise<void>;
  refetch: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<QueryObserverResult<InfiniteData<T | undefined>, unknown>>;
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  finished: boolean;
  hasNextPage?: boolean;
} => {
  const [sortOption, setSortOption] = useState<SortOption>({field: 'none', order: 'none'});
  const {data, fetchNextPage, refetch, isFetched, hasNextPage} = useInfiniteQuery(
    [key, sortOption, uri],
    query => fetchData(query.pageParam),
    {
      keepPreviousData: false,
      getNextPageParam: (lastPage, pages) =>
        !lastPage || lastPage.length === 0 ? pages.length : pages.length + 1,
    },
  );

  const createParamSortOption = (sortOption: SortOption) => {
    const {field, order} = sortOption;
    if (field === 'none' || order === 'none') {
      return '';
    }

    return `target_field=${field}&order=${order}`;
  };

  const createParamPaging = (page: number | undefined) => {
    if (!pageable) {
      return '';
    }

    const currentPage = page ?? 1;
    const currentSkip = (currentPage - 1) * 30;
    return `skip=${currentSkip}&size=30`;
  };

  const fetchData = async (page: number | undefined) => {
    const params = `${createParamPaging(page)}&${createParamSortOption(sortOption)}`;
    const apiUri = uri.includes('?') ? `${uri}&${params}` : `${uri}?${params}`;
    const response = await axios.get<T>(apiUri);
    if (typeof response.data === 'string') {
      return undefined;
    }
    return response.data;
  };

  const fetchNextData = async () => {
    if (!hasNextPage) {
      return;
    }
    await fetchNextPage();
  };

  return {
    data,
    fetchNextPage: fetchNextData,
    refetch,
    sortOption,
    setSortOption,
    finished: isFetched,
    hasNextPage: hasNextPage,
  };
};

export default usePageQuery;
