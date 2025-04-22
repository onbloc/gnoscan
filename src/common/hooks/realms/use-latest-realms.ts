import { useGetLatestRealmsQuery } from "@/common/react-query/realm";

export const useLatestRealms = () => {
  const { data: realms, isFetched } = useGetLatestRealmsQuery();

  return {
    realms: realms || [],
    isFetched,
  };
};
