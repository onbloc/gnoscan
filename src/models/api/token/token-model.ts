import { Amount } from "@/types/data-type";

export interface TokenModel {
  name: string;
  symbol: string;
  owner: string;
  holders: number;
  funcTypesList: string[];
  decimals: number;
  totalSupply: string;
  path: string;
  logoUrl: string | null;
}
