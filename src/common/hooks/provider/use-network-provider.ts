import { useContext } from "react";
import { NetworkContext } from "@/providers/network-provider";

export const useNetworkProvider = () => {
  const context = useContext(NetworkContext);
  if (context === null) {
    throw new Error("FAILED_INITIALIZE_PROVIDER");
  }
  return context;
};
