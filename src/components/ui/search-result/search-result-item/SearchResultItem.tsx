import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { SearchResult } from "@/repositories/api/search/response";

import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { toDisplayHash } from "@/common/utils/transaction.utility";
import Text from "@/components/ui/text";
import * as S from "./SearchResultItem.styles";

export const SearchResultItem = ({
  item,
  isMain,
  onClick,
}: {
  item: SearchResult;
  isMain?: boolean;
  onClick: () => void;
}) => {
  const { getUrlWithNetwork } = useNetwork();

  switch (item.type as SEARCH_RESULT_TYPE) {
    case SEARCH_RESULT_TYPE.ACCOUNT:
      return (
        <Link href={getUrlWithNetwork(`/account/${item.title}`)} passHref style={{ width: "100%" }}>
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {item.title}
                {item.description && (
                  <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                    {` (${item.description})`}
                  </Text>
                )}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.BLOCK:
      return (
        <Link href={getUrlWithNetwork(`/block/${item.title}`)} passHref style={{ width: "100%" }}>
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {item.title}
                <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                  {` (Block #${item.title})`}
                </Text>
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.TOKEN: {
      // The API `link` holds the token name (e.g. "/tokens/Gnoswap"), so build the token key from path and symbol.
      const tokenKey = item.description ? `${item.title}.${item.description}` : item.title;
      return (
        <Link href={getUrlWithNetwork(`/tokens/${tokenKey}`)} passHref style={{ width: "100%" }}>
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {formatDisplayPackagePath(stripGnoLandPrefix(item.title))}
                {item.description && (
                  <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                    {` (${item.description})`}
                  </Text>
                )}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );
    }

    case SEARCH_RESULT_TYPE.PROPOSAL:
      return (
        <Link href={item.link} target="_blank" passHref style={{ width: "100%" }}>
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {item.title}
                <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                  {` (${item.description || item.link})`}
                </Text>
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.REALM:
      return (
        <Link href={getUrlWithNetwork(`/realms/details?path=${item.title}`)} passHref style={{ width: "100%" }}>
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {formatDisplayPackagePath(stripGnoLandPrefix(item.title))}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.TRANSACTION: {
      const displayHash = toDisplayHash(item.title);
      return (
        <Link
          href={getUrlWithNetwork(`/transactions/details?txhash=${displayHash}`)}
          passHref
          style={{ width: "100%" }}
        >
          <S.List data-search-option onClick={onClick}>
            <S.FitContentAStyle>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {displayHash}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );
    }

    default:
      return (
        <S.List data-search-option onClick={onClick}>
          <S.FitContentAStyle>
            <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
              {item.title}
              {item.description && (
                <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                  {` (${item.description})`}
                </Text>
              )}
            </Text>
          </S.FitContentAStyle>
        </S.List>
      );
  }
};
