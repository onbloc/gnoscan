import React from "react";

import { useGetTokenById, useGetTokens, useGetTokenTransfersById } from "@/common/react-query/token/api";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";
import PathText from "@/components/ui/path-text/PathText";
import { TokenSummary } from "@/types/data-type";

import { useNetwork } from "@/common/hooks/use-network";
import { formatTokenDecimal, isWugnotPackagePath } from "@/common/utils/token.utility";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { formatUsd, formatUsdWhole, getUsdValue } from "@/common/utils/price.utility";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { useFetchRemainingPages } from "@/common/hooks/common/use-fetch-remaining-pages";
import { PriceChangeText } from "@/components/ui/text/price-change-text";
import { GRC20_REGISTRY_PATH, WUGNOT_DISPLAY_NAME } from "@/common/values/constant-value";
import Badge from "@/components/ui/badge";
import { AddressLink, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import DataSection from "@/components/view/details-data-section";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import * as S from "./TokenSummary.styles";
import PublicFunctions from "@/components/ui/public-functions";

interface TokenSummaryProps {
  tokenId: string;
}

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

const StandardNetworkTokenSummary = ({ tokenId }: TokenSummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetTokenById(tokenId);
  const { getTokenMeta } = useTokenResourceMeta();
  const { getPriceEntry } = useTokenPrice();
  // Same query as the Token Transfers tab, so the count comes from the shared cache.
  const { data: transfersData } = useGetTokenTransfersById({ path: tokenId }, { enabled: !!tokenId });
  const transferCount = transfersData?.pages[0]?.page.totalCount;
  // The detail API has no registration field, so read it from this package's row in the token list.
  const packagePath = data?.data?.path;
  const packageTokensQuery = useGetTokens({ packagePath }, { enabled: !!packagePath });
  const packageTokenRow = packageTokensQuery.data?.pages
    .flatMap(page => page.items)
    .find(item => item.tokenId === data?.data?.tokenId);
  const isRegistered = !!packageTokenRow?.registeredPackagePath;
  // A package can host more tokens than one page holds, so keep loading until this token's row is found.
  useFetchRemainingPages(packageTokensQuery, !!packagePath && !packageTokenRow);

  const tokenSummary: TokenSummary | null = React.useMemo(() => {
    const summaryData = data?.data;

    if (!summaryData) return null;

    const resolved = getTokenMeta(summaryData.tokenId || summaryData.path, {
      name: summaryData.name,
      symbol: summaryData.symbol,
      decimals: summaryData.decimals,
    });

    return {
      tokenId: summaryData.tokenId,
      slug: summaryData.slug,
      name: isWugnotPackagePath(summaryData.path) ? WUGNOT_DISPLAY_NAME : resolved.name,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
      packagePath: summaryData.path,
      owner: summaryData.owner,
      ownerName: summaryData.ownerName,
      ownerLabel: summaryData.ownerLabel,
      ownerLabelType: summaryData.ownerLabelType,
      functions: summaryData.funcTypesList,
      // Kept as a string so large supplies keep full precision for display and market cap.
      totalSupply: formatTokenDecimal(summaryData.totalSupply, resolved.decimals),
      holders: summaryData.holders,
    };
  }, [data?.data, getTokenMeta]);

  const files = React.useMemo(() => {
    const sourceFiles = data?.data?.sourceFiles;

    if (!Array.isArray(sourceFiles)) {
      return [];
    }

    return (
      data?.data?.sourceFiles?.map(file => {
        return {
          name: file.filename ?? "",
          body: file.content ?? "",
        };
      }) ?? []
    );
  }, [data?.data]);

  if (!isFetched) return <TableSkeleton />;

  const priceEntry = tokenSummary ? getPriceEntry(tokenSummary.tokenId || tokenSummary.packagePath) : null;
  const price = priceEntry ? formatUsd(priceEntry.price) : null;
  const marketCap = priceEntry ? formatUsdWhole(getUsdValue(tokenSummary?.totalSupply ?? 0, priceEntry.price)) : null;

  return (
    <DataSection title="Summary">
      <Field label="Name">
        <Badge>{tokenSummary?.name}</Badge>
      </Field>
      <Field label="Symbol">
        <Badge>{tokenSummary?.symbol}</Badge>
      </Field>
      <FieldWithTooltip label="Path" tooltipContent={TOOLTIP_PACKAGE_PATH}>
        <Badge>
          <Text type="p4" color="blue" className="username-text ellipsis">
            <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${tokenSummary?.packagePath}`)}>
              <PathText path={tokenSummary?.packagePath} />
            </S.StyledA>
          </Text>
          <CopyTooltip variant="path" copyText={tokenSummary?.packagePath} />
        </Badge>
      </FieldWithTooltip>
      <Field label="Registered">
        {isRegistered ? (
          <Badge>
            <Text type="p4" color="blue" className="username-text">
              <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${GRC20_REGISTRY_PATH}`)}>
                {formatDisplayPackagePath(GRC20_REGISTRY_PATH)}
              </S.StyledA>
            </Text>
            <CopyTooltip variant="path" copyText={GRC20_REGISTRY_PATH} />
          </Badge>
        ) : (
          <Badge>-</Badge>
        )}
      </Field>
      <Field label="Decimals">
        <Badge>{tokenSummary?.decimals}</Badge>
      </Field>
      <DLWrap>
        <dt>Public Functions</dt>
        <PublicFunctions>
          {(tokenSummary?.functions ?? []).map((functionName: string, index: number) => (
            <Badge type="blue" key={index}>
              <Text type="p4" color="white">
                {functionName}
              </Text>
            </Badge>
          ))}
        </PublicFunctions>
      </DLWrap>
      <Field label="Creator">
        {tokenSummary?.owner === "genesis" ? (
          <Badge>
            <Text type="p4" color="blue" className="ellipsis">
              {getAddressDisplayText({
                address: tokenSummary?.owner,
                name: tokenSummary?.ownerName,
                label: tokenSummary?.ownerLabel,
              }) || ""}
            </Text>
          </Badge>
        ) : (
          <AddressLink
            address={tokenSummary?.owner || ""}
            addressName={tokenSummary?.ownerName || ""}
            copyText={tokenSummary?.owner || ""}
            getUrlWithNetwork={getUrlWithNetwork}
            label={tokenSummary?.ownerLabel}
            labelType={tokenSummary?.ownerLabelType}
          />
        )}
      </Field>
      <Field
        label={
          <span>
            Market Cap <S.Divider>|</S.Divider> Price
          </span>
        }
      >
        <Badge>
          {price ? (
            <S.PriceText>
              <span>
                {marketCap ?? "-"} <S.Divider>|</S.Divider> {price}
              </span>
              <PriceChangeText change={priceEntry?.changeRateOneDay} />
            </S.PriceText>
          ) : (
            "-"
          )}
        </Badge>
      </Field>
      <Field label="Total Supply">
        <Badge>{makeDisplayNumber(tokenSummary?.totalSupply || 0)}</Badge>
      </Field>
      <Field label="Holders">
        <Badge>{makeDisplayNumber(tokenSummary?.holders || 0)}</Badge>
      </Field>
      {/* Counts transactions that moved this token, the same total as the Token Transfers tab. */}
      <Field label="Transfers">
        <Badge>{transferCount === undefined ? "-" : makeDisplayNumber(transferCount)}</Badge>
      </Field>
      {files && files.length > 0 && <ShowLog isTabLog={true} files={files} />}
    </DataSection>
  );
};

export default StandardNetworkTokenSummary;
