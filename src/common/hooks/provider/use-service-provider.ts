import { ServiceContext } from "@/providers/service-provider";
import { useContext } from "react";

export const useServiceProvider = () => {
  const context = useContext(ServiceContext);
  if (context === null) {
    throw new Error("FAILED_INITIALIZE_PROVIDER");
  }
  return context;
};
