import React from "react";
import Link from "next/link";

import { Amount } from "@/types/data-type";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";

import * as S from "./TokenSummary.styles";
import Text from "@/components/ui/text";
import Badge from "@/components/ui/badge";
import DataSection from "@/components/view/details-data-section";
import { Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { DLWrap, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";
import PublicFunctions from "@/components/ui/public-functions";

interface TokenSummaryProps {
  tokenPath: string;
  isDesktop: boolean;
}

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

const CustomNetworkTokenSummary = ({ tokenPath, isDesktop }: TokenSummaryProps) => {
  const { summary: summaryData, files, isFetched: isFetchedToken } = useToken(tokenPath);
  const { isFetchedGRC20Tokens, getTokenAmount } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();
  const { isFetched: isFetchedUsername, getName } = useUsername();

  const isFetched = React.useMemo(() => {
    return isFetchedToken && isFetchedUsername && isFetchedGRC20Tokens;
  }, [isFetchedToken, isFetchedUsername, isFetchedGRC20Tokens]);

  const displayTotalSupply = React.useMemo(() => {
    if (!isFetchedGRC20Tokens) return "-";
    return makeDisplayNumber(getTokenAmount(summaryData.packagePath, summaryData.totalSupply).value);
  }, [isFetchedGRC20Tokens, summaryData.packagePath, summaryData.totalSupply]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <Field label="Name" isDesktop={isDesktop}>
        <Badge>{summaryData.name}</Badge>
      </Field>
      <Field label="Symbol" isDesktop={isDesktop}>
        <Badge>{summaryData.symbol}</Badge>
      </Field>
      <Field label="Total Supply" isDesktop={isDesktop}>
        <Badge>{displayTotalSupply}</Badge>
      </Field>
      <Field label="Decimals" isDesktop={isDesktop}>
        <Badge>{summaryData.decimals}</Badge>
      </Field>
      <FieldWithTooltip label="Path" tooltipContent={TOOLTIP_PACKAGE_PATH} isDesktop={isDesktop}>
        <Badge>
          <Text type="p4" color="blue" className="username-text">
            <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${summaryData.packagePath}`)}>
              {formatDisplayPackagePath(summaryData.packagePath)}
            </S.StyledA>
          </Text>
          <CopyTooltip variant="path" copyText={summaryData.packagePath} />
        </Badge>
      </FieldWithTooltip>
      <DLWrap desktop={isDesktop}>
        <dt>Public Functions</dt>
        <PublicFunctions>
          {summaryData.functions.map((functionName: string, index: number) => (
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
          {summaryData.owner && summaryData.owner === "genesis" ? (
            <Text type="p4" color="blue" className="ellipsis">
              {summaryData.owner}
            </Text>
          ) : (
            <FitContentSpan>
              <Link href={getUrlWithNetwork(`/account/${summaryData.owner}`)} passHref>
                <Text type="p4" color="blue" className="ellipsis">
                  {getName(summaryData.owner) || summaryData.owner}
                </Text>
              </Link>
            </FitContentSpan>
          )}
        </Badge>
      </Field>
      <Field label="Holders" isDesktop={isDesktop}>
        <Badge>{summaryData.holders}</Badge>
      </Field>
      {files && <ShowLog isTabLog={true} files={files} btnTextType="Logs" />}
    </DataSection>
  );
};

export default CustomNetworkTokenSummary;
