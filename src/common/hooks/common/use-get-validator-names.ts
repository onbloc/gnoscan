import { useGetValidatorInfosQuery } from "@/common/react-query/chain";

export const useGetValidatorNames = () => {
  const { isFetched, data: validatorInfos } = useGetValidatorInfosQuery();

  return {
    isFetched,
    validatorInfos,
  };
};
