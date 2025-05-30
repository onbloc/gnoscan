import React from "react";
import Link from "next/link";

import { Amount } from "@/types/data-type";
import { formatDisplayPackagePath, makeDisplayNumber } from "@/common/utils/string-util";

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
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";

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
      <DLWrap desktop={isDesktop}>
        <dt>Name</dt>
        <dd>
          <Badge>{summaryData.name}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Symbol</dt>
        <dd>
          <Badge>{summaryData.symbol}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Supply</dt>
        <dd>
          <Badge>{displayTotalSupply}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Decimals</dt>
        <dd>
          <Badge>{summaryData.decimals}</Badge>
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
              <S.StyledA href={getUrlWithNetwork(`/realms/details?path=${summaryData.packagePath}`)}>
                {formatDisplayPackagePath(summaryData.packagePath)}
              </S.StyledA>
            </Text>
            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={summaryData.packagePath}
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
          {summaryData.functions.map((functionName: string, index: number) => (
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
            {summaryData.owner && summaryData.owner === "genesis" ? (
              <Text type="p4" color="blue" className="ellipsis">
                {summaryData.owner}
              </Text>
            ) : (
              <FitContentA>
                <Link href={getUrlWithNetwork(`/account/${summaryData.owner}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {getName(summaryData.owner) || summaryData.owner}
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
          <Badge>{summaryData.holders}</Badge>
        </dd>
      </DLWrap>
      {files && <ShowLog isTabLog={true} files={files} btnTextType="Logs" />}
    </DataSection>
  );
};

export default CustomNetworkTokenSummary;
