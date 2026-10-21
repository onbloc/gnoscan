import { TokenModel } from "@/models/api/token/token-model";
import { GRC20Info } from "@/repositories/realm-repository.ts";

export interface GRC20InfoWithLogo extends Omit<GRC20Info, "totalSupply"> {
  /** Raw API string, kept unconverted so supplies past 2^53 keep full precision for display and market cap. */
  totalSupply: string;
  logoUrl: string;
  registered: boolean;
  transactionCount24h: number | null;
  createdAt: string | null;
}

export class TokenMapper {
  public static fromApiResponse(response: TokenModel): GRC20InfoWithLogo {
    return {
      tokenId: response.tokenId,
      slug: response.slug,
      packagePath: response.path,
      owner: response.owner,
      name: response.name,
      symbol: response.symbol,
      decimals: response.decimals,
      functions: response.funcTypesList,
      totalSupply: response.totalSupply,
      holders: response.holders,
      logoUrl: response.logoUrl ?? "",
      registered: !!response.registeredPackagePath,
      transactionCount24h: response.transactionCount24h ?? null,
      createdAt: response.createdAt ?? null,
    };
  }

  public static fromApiResponses(responses: TokenModel[]): GRC20InfoWithLogo[] {
    return responses.map(response => this.fromApiResponse(response));
  }
}
