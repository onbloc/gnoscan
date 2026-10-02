import React from "react";

import { useGetTokenById } from "@/common/react-query/token/api";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";
import { TokenSummary } from "@/types/data-type";

import { useNetwork } from "@/common/hooks/use-network";
import { formatTokenDecimal, isWugnotPackagePath } from "@/common/utils/token.utility";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { WUGNOT_DISPLAY_NAME } from "@/common/values/constant-value";
import Badge from "@/components/ui/badge";
import { AddressDisplayLink, Field, FieldWithTooltip } from "@/components/ui/detail-field";
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
  isDesktop: boolean;
}

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

const StandardNetworkTokenSummary = ({ tokenId, isDesktop }: TokenSummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetTokenById(tokenId);
  const { getTokenMeta } = useTokenResourceMeta();

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

  return (
    <DataSection title="Summary">
      <Field label="Name" isDesktop={isDesktop}>
        <Badge>{tokenSummary?.name}</Badge>
      </Field>
      <Field label="Symbol" isDesktop={isDesktop}>
        <Badge>{tokenSummary?.symbol}</Badge>
      </Field>
      <Field label="Total Supply" isDesktop={isDesktop}>
        <Badge>{makeDisplayNumber(tokenSummary?.totalSupply || 0)}</Badge>
      </Field>
      <Field label="Decimals" isDesktop={isDesktop}>
        <Badge>{tokenSummary?.decimals}</Badge>
      </Field>
      <FieldWithTooltip label="Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <Badge>
          <Text type="p4" color="blue" className="username-text">
            <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${tokenSummary?.packagePath}`)}>
              {formatDisplayPackagePath(tokenSummary?.packagePath)}
            </S.StyledA>
          </Text>
          <CopyTooltip variant="path" copyText={tokenSummary?.packagePath} />
        </Badge>
      </FieldWithTooltip>
      <DLWrap desktop={isDesktop}>
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
      <Field label="Owner" isDesktop={isDesktop}>
        <Badge>
          {tokenSummary?.owner && tokenSummary?.owner === "genesis" ? (
            <Text type="p4" color="blue" className="ellipsis">
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
        </Badge>
      </Field>
      <Field label="Holders" isDesktop={isDesktop}>
        <Badge>{makeDisplayNumber(tokenSummary?.holders || 0)}</Badge>
      </Field>
      {files && files.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Logs" />}
    </DataSection>
  );
};

export default StandardNetworkTokenSummary;
