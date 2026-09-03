import { processSearchKeyword } from "../../../common/utils/search.utility";

const removeTrailingQuestionMark = (url: string) => (url.endsWith("?") ? url.slice(0, -1) : url);

export const getSearchSubmitUrl = (value: string, getUrlWithNetwork: (uri: string) => string) => {
  const keyword = value.trim();

  if (!keyword) {
    return null;
  }

  const redirectResult = processSearchKeyword(keyword, {});
  const destination = redirectResult?.destination ?? `/search?keyword=${encodeURIComponent(keyword)}`;

  return removeTrailingQuestionMark(getUrlWithNetwork(removeTrailingQuestionMark(destination)));
};
