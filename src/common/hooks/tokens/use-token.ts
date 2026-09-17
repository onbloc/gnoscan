import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import {
  useGetGRC20Token,
  useGetHoldersQuery,
  useGetRealmFunctionsQuery,
  useGetRealmTotalSupplyQuery,
} from "@/common/react-query/realm";
import { isWugnotPackagePath, WUGNOT_DISPLAY_NAME } from "@/common/utils/token.utility";
import { TokenSummary } from "@/types/data-type";
import { useMemo } from "react";

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
  const { getTokenMeta } = useTokenResourceMeta();

  const tokenSummary: TokenSummary = useMemo(() => {
    const resolved = data?.tokenInfo.packagePath
      ? getTokenMeta(data.tokenInfo.packagePath, {
          name: data.tokenInfo.name || "",
          symbol: data.tokenInfo.symbol || "",
          decimals: Number(data.tokenInfo.decimals) || 0,
        })
      : undefined;

    const name =
      data?.tokenInfo.packagePath && isWugnotPackagePath(data.tokenInfo.packagePath)
        ? WUGNOT_DISPLAY_NAME
        : resolved?.name ?? data?.tokenInfo.name ?? "";

    return {
      tokenId: data?.tokenInfo.tokenId || "",
      slug: data?.tokenInfo.slug || "",
      name,
      symbol: resolved?.symbol ?? data?.tokenInfo.symbol ?? "",
      decimals: resolved?.decimals ?? data?.tokenInfo.decimals ?? "",
      packagePath: data?.tokenInfo.packagePath || "",
      owner: data?.tokenInfo.owner || "",
      functions: realmFunctions?.map(func => func.functionName) || [],
      totalSupply,
      holders,
    };
  }, [data, realmFunctions, totalSupply, holders, getTokenMeta]);

  return {
    isFetched: isFetched && isFetchedRealmFunctions,
    summary: tokenSummary,
    files: data?.realmTransaction.messages.flatMap(m => m.value.package?.files || []),
  };
};
