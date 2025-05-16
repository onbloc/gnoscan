import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";
import { SearchResult } from "@/repositories/api/search/response";
import { GNO_NETWORK_PREFIXES } from "@/common/values/gno.constant";

import * as S from "./SearchResultItem.styles";
import Text from "@/components/ui/text";
import { formatDisplayTokenPath } from "@/common/utils/token.utility";

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
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
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
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
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

    case SEARCH_RESULT_TYPE.TOKEN:
      return (
        <Link href={getUrlWithNetwork(`/tokens/${item.title}`)} passHref style={{ width: "100%" }}>
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {formatDisplayTokenPath(item.title.replace(GNO_NETWORK_PREFIXES.GNO_LAND, ""), 4)}
                <Text type={isMain ? "p4" : "body1"} color="primary" display="inline-block">
                  {` (${item.description || item.link})`}
                </Text>
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.PROPOSAL:
      return (
        <Link href={item.link} target="_blank" passHref style={{ width: "100%" }}>
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
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
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {formatDisplayTokenPath(item.title.replace(GNO_NETWORK_PREFIXES.GNO_LAND, ""), 4)}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    case SEARCH_RESULT_TYPE.TRANSACTION:
      return (
        <Link href={getUrlWithNetwork(`/transactions/details?txhash=${item.title}`)} passHref style={{ width: "100%" }}>
          <S.List>
            <S.FitContentAStyle onClick={onClick}>
              <Text type={isMain ? "p4" : "body1"} color="primary" className="ellipsis">
                {item.title}
              </Text>
            </S.FitContentAStyle>
          </S.List>
        </Link>
      );

    default:
      return (
        <S.List>
          <S.FitContentAStyle onClick={onClick}>
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
