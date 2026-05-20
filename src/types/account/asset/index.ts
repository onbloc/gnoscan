import { Amount } from "@/types/data-type";

export interface AccountAssetViewModel {
  tokenId: string;
  slug: string;
  amount: Amount;
  logoUrl: string;
  packagePath: string;
}
