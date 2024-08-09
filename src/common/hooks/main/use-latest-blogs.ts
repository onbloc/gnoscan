import {useGetBlogs} from '../common/use-get-board';

export const useLatestBlogs = () => {
  const {data: blogs, isFetched: isFetchedBlogs} = useGetBlogs();

  return {
    isFetched: isFetchedBlogs,
    data: blogs,
  };
};
