import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {Blog, BlogDetail} from '@/types/data-type';

export interface SimpleTransaction {
  success: boolean;
  block_height: number;
  messages: {
    value: {
      from_address?: string;
      caller?: string;
      pkg_path?: string;
      func?: string;
      args?: string[] | null;
      creator?: string;
    };
  }[];
  gas_fee: {
    amount: number;
    denom: string;
  };
  time?: string;
  gas_used: number;
  gas_wanted: number;
}

export const useGetBlogs = (blockHeight?: number | null) => {
  const {realmRepository} = useServiceProvider();

  return useQuery<Blog[]>({
    queryKey: ['useGetBlogs', blockHeight || ''],
    queryFn: () => {
      if (!realmRepository) {
        return [];
      }
      return realmRepository.getBlogs();
    },
    enabled: !!realmRepository,
  });
};

export const useGetBlogPublisher = (path: string) => {
  const {realmRepository} = useServiceProvider();

  return useQuery<string | null>({
    queryKey: ['useGetBlogPublisher', path],
    queryFn: () => {
      if (!realmRepository) {
        return null;
      }
      return realmRepository.getBlogPublisher(path);
    },
    enabled: !!realmRepository,
  });
};
