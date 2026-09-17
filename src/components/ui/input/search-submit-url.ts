import { ApiSearchRepository } from "@/repositories/api/search/api-search-repository";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";

import { isBech32Address } from "../../../common/utils/bech32.utility";
import { processSearchKeyword } from "../../../common/utils/search.utility";

const removeTrailingQuestionMark = (url: string) => (url.endsWith("?") ? url.slice(0, -1) : url);

// A realm's bech32 address (derived from its package path) also matches `processBech32Address`,
// so it must be checked against the backend before falling back to the account page.
async function resolveRealmAddressDestination(
  keyword: string,
  isCustomNetwork: boolean,
  apiSearchRepository: ApiSearchRepository | null,
): Promise<string | null> {
  if (isCustomNetwork || !apiSearchRepository || !isBech32Address(keyword)) {
    return null;
  }

  try {
    const results = await apiSearchRepository.getSearch(keyword);
    const realmResult = results?.find(result => result.type === SEARCH_RESULT_TYPE.REALM);

    return realmResult ? `/realms/details?path=${realmResult.title}` : null;
  } catch {
    return null;
  }
}

export const getSearchSubmitUrl = async (
  value: string,
  getUrlWithNetwork: (uri: string) => string,
  isCustomNetwork: boolean,
  apiSearchRepository: ApiSearchRepository | null,
) => {
  const keyword = value.trim();

  if (!keyword) {
    return null;
  }

  const realmDestination = await resolveRealmAddressDestination(keyword, isCustomNetwork, apiSearchRepository);
  const redirectResult = processSearchKeyword(keyword, {});
  const destination =
    realmDestination ?? redirectResult?.destination ?? `/search?keyword=${encodeURIComponent(keyword)}`;

  return removeTrailingQuestionMark(getUrlWithNetwork(removeTrailingQuestionMark(destination)));
};
