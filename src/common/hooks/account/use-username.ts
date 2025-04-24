import { useCallback, useMemo } from "react";
import { useGetUsername } from "../common/use-get-username";
import { useGetValidatorNames } from "../common/use-get-validator-names";
import { PORTAL_LOOP_CHAIN_ID } from "@/common/values/constant-value";

export const useUsername = () => {
  const { data = {}, isFetched, isLoading } = useGetUsername();
  const { validatorInfos, isFetched: isFetchedValidatorInfos } = useGetValidatorNames();

  const validatorNames = useMemo(() => {
    if (!validatorInfos) {
      return {};
    }

    return validatorInfos.reduce<{ [key in string]: string }>((acc, current) => {
      acc[current.address] = current.name;
      return acc;
    }, {});
  }, [validatorInfos]);

  const totalUsers = useMemo(() => {
    return Object.keys(data || {}).length;
  }, [data]);

  const getName = useCallback(
    (address: string) => {
      return data?.[address];
    },
    [data],
  );

  const getUserUrl = useCallback(
    (networkId: string, userName: string) => {
      if (!networkId || !userName) return null;

      const baseUrl = (networkId = PORTAL_LOOP_CHAIN_ID ? "https://gno.land" : `https://${networkId}.gno.land`);

      return `${baseUrl}/r/demo/users:${userName}`;
    },
    [data, validatorNames],
  );

  const getNameWithMoniker = useCallback(
    (address: string) => {
      return validatorNames?.[address] || data?.[address];
    },
    [data, validatorNames],
  );

  const getAddress = useCallback(
    (name: string) => {
      return Object.entries(data || {}).find(entry => entry[1] === name)?.[0] || null;
    },
    [data],
  );

  return {
    isFetched: isFetched && isFetchedValidatorInfos,
    isLoading,
    usernames: data,
    totalUsers,
    getName,
    getNameWithMoniker,
    getAddress,
    getUserUrl,
  };
};
