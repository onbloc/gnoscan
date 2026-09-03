import { TokenListSortOption } from "@/common/types/token";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";

// Translates the UI sort option into API request params. Returns no sort/order
// when unsorted so the server falls back to its default order.
export const toTokenListApiSortParams = (
  sortOption: TokenListSortOption,
): Pick<GetTokensRequestParameters, "sort" | "order"> => {
  if (sortOption.field === "none" || sortOption.order === "none") {
    return {};
  }

  return {
    sort: sortOption.field,
    order: sortOption.order,
  };
};
