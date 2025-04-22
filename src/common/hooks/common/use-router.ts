import { useRouter as useNextRouter } from "next/router";
import { useNetwork } from "../use-network";

export const useRouter = () => {
  const { query, push, ...remain } = useNextRouter();
  const { getUrlWithNetwork } = useNetwork();

  const customPush = (path: string) => {
    return push(getUrlWithNetwork(path));
  };

  return {
    ...remain,
    query,
    push: customPush,
  };
};
