import React from "react";
import Link from "next/link";

import { TokenSummary } from "@/types/data-type";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";
import { useGetTokenById } from "@/common/react-query/token/api";

import * as S from "./TokenSummary.styles";
import Text from "@/components/ui/text";
import Badge from "@/components/ui/badge";
import DataSection from "@/components/view/details-data-section";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Tooltip from "@/components/ui/tooltip";
import ShowLog from "@/components/ui/show-log";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useNetwork } from "@/common/hooks/use-network";

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

const StandardNetworkTokenSummary = ({ tokenPath, isDesktop }: TokenSummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();

  const { data, isFetched } = useGetTokenById(tokenPath);

  const tokenSummary: TokenSummary | null = React.useMemo(() => {
    const summaryData = data?.data;

    if (!summaryData) return null;

    return {
      name: summaryData.name,
      symbol: summaryData.symbol,
      decimals: summaryData.decimals,
      packagePath: summaryData.path,
      owner: summaryData.owner,
      functions: summaryData.funcTypesList,
      totalSupply: Number(summaryData.totalSupply),
      holders: summaryData.holders,
    };
  }, [data?.data]);

  const files = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.sourceFiles.map(file => {
      return {
        name: file.filename,
        body: file.content,
      };
    });
  }, [data?.data]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <DLWrap desktop={isDesktop}>
        <dt>Name</dt>
        <dd>
          <Badge>{tokenSummary?.name}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Symbol</dt>
        <dd>
          <Badge>{tokenSummary?.symbol}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Supply</dt>
        <dd>
          <Badge>{makeDisplayNumber(tokenSummary?.totalSupply || 0)}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Decimals</dt>
        <dd>
          <Badge>{tokenSummary?.decimals}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>
          Path
          <div className="tooltip-wrapper">
            <Tooltip content={TOOLTIP_PACKAGE_PATH}>
              <IconTooltip />
            </Tooltip>
          </div>
        </dt>
        <dd>
          <Badge>
            <Text type="p4" color="blue" className="username-text">
              <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${tokenSummary?.packagePath}`)}>
                {formatDisplayPackagePath(tokenSummary?.packagePath)}
              </S.StyledA>
            </Text>
            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={tokenSummary?.packagePath}
              width={85}
            >
              <IconCopy className="svg-icon" />
            </Tooltip>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Public Functions</dt>
        <dd className="function-wrapper">
          {tokenSummary?.functions.map((functionName: string, index: number) => (
            <Badge type="blue" key={index}>
              <Text type="p4" color="white">
                {functionName}
              </Text>
            </Badge>
          ))}
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Owner</dt>
        <dd>
          <Badge>
            {tokenSummary?.owner && tokenSummary?.owner === "genesis" ? (
              <Text type="p4" color="blue" className="ellipsis">
                {tokenSummary?.owner}
              </Text>
            ) : (
              <FitContentA>
                <Link href={getUrlWithNetwork(`/account/${tokenSummary?.owner}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {tokenSummary?.owner}
                  </Text>
                </Link>
              </FitContentA>
            )}
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Holders</dt>
        <dd>
          <Badge>{makeDisplayNumber(tokenSummary?.holders || 0)}</Badge>
        </dd>
      </DLWrap>
      {files && files.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Logs" />}
    </DataSection>
  );
};

export default StandardNetworkTokenSummary;
