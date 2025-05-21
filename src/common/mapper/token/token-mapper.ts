import { TokenModel } from "@/models/api/token/token-model";
import { GRC20Info } from "@/repositories/realm-repository.ts";

export interface GRC20InfoWithLogo extends GRC20Info {
  logoUrl: string;
}

export class TokenMapper {
  public static fromApiResponse(response: TokenModel): GRC20InfoWithLogo {
    return {
      packagePath: response.path,
      owner: response.owner,
      name: response.name,
      symbol: response.symbol,
      decimals: response.decimals,
      functions: response.funcTypesList,
      totalSupply: Number(response.totalSupply),
      holders: response.holders,
      logoUrl: response.logoUrl ?? "",
    };
  }

  public static fromApiResponses(responses: TokenModel[]): GRC20InfoWithLogo[] {
    return responses.map(response => this.fromApiResponse(response));
  }
}
