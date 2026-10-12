import React from "react";

import { useGetTokenById } from "@/common/react-query/token/api";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";
import { TokenSummary } from "@/types/data-type";

import { useNetwork } from "@/common/hooks/use-network";
import { formatTokenDecimal, isWugnotPackagePath } from "@/common/utils/token.utility";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { formatUsd, formatUsdWhole, getUsdValue } from "@/common/utils/price.utility";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { PriceChangeText } from "@/components/ui/text/price-change-text";
import { WUGNOT_DISPLAY_NAME } from "@/common/values/constant-value";
import Badge from "@/components/ui/badge";
import { AddressDisplayLink, Field } from "@/components/ui/detail-field";
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

const StandardNetworkTokenSummary = ({ tokenId }: TokenSummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetTokenById(tokenId);
  const { getTokenMeta } = useTokenResourceMeta();
  const { getPriceEntry } = useTokenPrice();

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
      totalSupply: Number(formatTokenDecimal(summaryData.totalSupply, resolved.decimals)),
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
    <S.SummarySection>
      <DataSection title="Summary">
        <Field label="Name">
          <Badge>{tokenSummary?.name}</Badge>
        </Field>
        <Field label="Symbol">
          <Badge>{tokenSummary?.symbol}</Badge>
        </Field>
        <Field
          label={
            <>
              Market Cap <S.Divider>|</S.Divider> Price
            </>
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
        <Field label="Decimals">
          <Badge>{tokenSummary?.decimals}</Badge>
        </Field>
        <Field label="Holders">
          <Badge>{makeDisplayNumber(tokenSummary?.holders || 0)}</Badge>
        </Field>
        {/* ponytail: the API has no transfer count for the token realm yet, so this shows "-" until it does. */}
        <Field label="Transfers">
          <Badge>-</Badge>
        </Field>
        <Field label="Path">
          <Badge>
            <Text type="p4" color="blue" className="username-text">
              <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${tokenSummary?.packagePath}`)}>
                {formatDisplayPackagePath(tokenSummary?.packagePath)}
              </S.StyledA>
            </Text>
            <CopyTooltip variant="path" copyText={tokenSummary?.packagePath} />
          </Badge>
        </Field>
        {/* ponytail: the API does not report grc20reg registration yet, so this shows "-" until it does. */}
        <Field label="Registered">
          <Badge>-</Badge>
        </Field>
        <Field label="Creator">
          <Badge>
            <S.CreatorText>
              {tokenSummary?.owner && tokenSummary?.owner === "genesis" ? (
                <Text type="p4" className="ellipsis">
                  {getAddressDisplayText({
                    address: tokenSummary?.owner,
                    name: tokenSummary?.ownerName,
                    label: tokenSummary?.ownerLabel,
                  }) || ""}
                </Text>
              ) : (
                <AddressDisplayLink
                  address={tokenSummary?.owner}
                  name={tokenSummary?.ownerName}
                  label={tokenSummary?.ownerLabel}
                  labelType={tokenSummary?.ownerLabelType}
                  getUrlWithNetwork={getUrlWithNetwork}
                />
              )}
              {tokenSummary?.owner && tokenSummary.owner !== "genesis" && (
                <CopyTooltip variant="address" copyText={tokenSummary.owner} />
              )}
            </S.CreatorText>
          </Badge>
        </Field>
        <DLWrap>
          <dt>Public Functions</dt>
          <PublicFunctions>
            {(tokenSummary?.functions ?? []).map((functionName: string, index: number) => (
              <Badge type="blue" key={index}>
                <Text type="h7" color="white" fontWeight={600}>
                  {functionName}
                </Text>
              </Badge>
            ))}
          </PublicFunctions>
        </DLWrap>
        {files && files.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Source" />}
      </DataSection>
    </S.SummarySection>
  );
};

export default StandardNetworkTokenSummary;
