import { useMemo } from "react";
import {
  useGetGRC20Token,
  useGetHoldersQuery,
  useGetRealmFunctionsQuery,
  useGetRealmTotalSupplyQuery,
} from "@/common/react-query/realm";
import { TokenSummary } from "@/types/data-type";

export const useToken = (path: string[] | string | undefined) => {
  const packagePath = useMemo(() => {
    if (!path) {
      return null;
    }

    if (Array.isArray(path)) {
      return path.join("/");
    }

    return path;
  }, [path]);
  const { data: totalSupply = 0 } = useGetRealmTotalSupplyQuery(packagePath);
  const { data, isFetched } = useGetGRC20Token(packagePath);
  const { data: holders = 0 } = useGetHoldersQuery(packagePath);
  const { data: realmFunctions, isFetched: isFetchedRealmFunctions } = useGetRealmFunctionsQuery(packagePath);

  const tokenSummary: TokenSummary = useMemo(() => {
    return {
      name: data?.tokenInfo.name || "",
      symbol: data?.tokenInfo.symbol || "",
      decimals: data?.tokenInfo.decimals || "",
      packagePath: data?.tokenInfo.packagePath || "",
      owner: data?.tokenInfo.owner || "",
      functions: realmFunctions?.map(func => func.functionName) || [],
      totalSupply,
      holders,
    };
  }, [data, realmFunctions, totalSupply, holders]);

  return {
    isFetched: isFetched && isFetchedRealmFunctions,
    summary: tokenSummary,
    files: data?.realmTransaction.messages.flatMap(m => m.value.package?.files || []),
  };
};
