import React from "react";
import Link from "next/link";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { NonMobile } from "@/common/hooks/use-media";
import { RealmSummary, Transaction } from "@/types/data-type";
import { makeTemplate } from "@/common/utils/template.utils";
import { GNOSTUDIO_REALM_FUNCTION_TEMPLATE, GNOSTUDIO_REALM_TEMPLATE } from "@/common/values/url.constant";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetRealmByPath, useGetRealmTransactionsByPath } from "@/common/react-query/realm/api";

import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import DataSection from "../../details-data-section";
import { DLWrap, FitContentA, LinkWrapper } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Tooltip from "@/components/ui/tooltip";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { RealmTotalContractCalls } from "../realm-total-contract-calls/RealmTotalContractCalls";
import { RealmTotalUsedFeeAmount } from "../realm-total-used-fee-amount/RealmTotalUsedFeeAmount";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";

interface RealmSummaryProps {
  path: string;
  isDesktop: boolean;
}

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

const TOOLTIP_BALANCE = (
  <>
    Balances available to be spent
    <br />
    by this realm.
  </>
);

const StandardNetworkRealmSummary = ({ path, isDesktop }: RealmSummaryProps) => {
  const { currentNetwork, getUrlWithNetwork } = useNetwork();
  const { getTokenAmount } = useTokenMeta();

  const { data: realmData, isFetched: isFetchedRealmData } = useGetRealmByPath(path);
  const { data: realmTransactionsData, isFetched: isFetchedRealmTransactionsData } =
    useGetRealmTransactionsByPath(path);

  const realmSummary: RealmSummary | null = React.useMemo(() => {
    if (!realmData?.data) return null;

    return RealmMapper.realmSummaryFromApiResponse(realmData.data);
  }, [realmData?.data]);

  const realmTransactions: Transaction[] = React.useMemo(() => {
    if (!realmTransactionsData?.items) return [];

    return RealmMapper.realmTransactionFromApiResponses(realmTransactionsData.items);
  }, [realmTransactionsData?.items]);

  const moveGnoStudioViewRealm = React.useCallback(() => {
    if (!currentNetwork) {
      return;
    }

    const url = makeTemplate(GNOSTUDIO_REALM_TEMPLATE, {
      PACKAGE_PATH: path,
      NETWORK: currentNetwork?.chainId || "",
    });
    window.open(url, "_blank");
  }, [path, currentNetwork]);

  const moveGnoStudioViewRealmFunction = React.useCallback(
    (functionName: string) => {
      if (!currentNetwork) {
        return;
      }

      const url = makeTemplate(GNOSTUDIO_REALM_FUNCTION_TEMPLATE, {
        PACKAGE_PATH: path,
        NETWORK: currentNetwork?.chainId || "",
        FUNCTION_NAME: functionName,
      });
      window.open(url, "_blank");
    },
    [path, currentNetwork],
  );

  const balanceStr = React.useMemo(() => {
    if (!realmSummary?.balance) {
      return "-";
    }
    return "-";
    // const amount = getTokenAmount(GNOTToken.denom, summary.balance.value);
    // return `${amount.value} ${amount.denom}`;
  }, [getTokenAmount, realmSummary?.balance]);

  if (!isFetchedRealmData) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <DLWrap desktop={isDesktop}>
        <dt>Name</dt>
        <dd>
          <Badge>{realmSummary?.name}</Badge>
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
        <dd className="path-wrapper">
          <Badge>
            <Text type="p4" color="reverse" className="ellipsis">
              {formatDisplayPackagePath(realmSummary?.path)}
            </Text>

            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={realmSummary?.path}
              width={85}
            >
              <IconCopy className="svg-icon" />
            </Tooltip>
          </Badge>

          <NonMobile>
            <LinkWrapper onClick={moveGnoStudioViewRealm}>
              <Text type="p4" className="ellipsis">
                Try in GnoStudio
              </Text>
              <IconLink className="icon-link" />
            </LinkWrapper>
          </NonMobile>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Realm Address</dt>
        <dd>
          <Badge>
            <Text type="p4" color="reverse" className="ellipsis">
              {realmSummary?.realmAddress || ""}
            </Text>

            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={realmSummary?.realmAddress || ""}
              width={85}
            >
              <IconCopy className="svg-icon" />
            </Tooltip>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Functions</dt>
        <dd className="function-wrapper">
          {realmSummary?.funcs?.map((v: string, index: number) => (
            <Badge className="link" key={index} type="blue" onClick={() => moveGnoStudioViewRealmFunction(v)}>
              <Tooltip className="tooltip" content="Click to try in GnoStudio">
                <Text type="p4" color="white">
                  {v}
                </Text>
              </Tooltip>
            </Badge>
          ))}
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Publisher</dt>
        <dd>
          <Badge>
            {realmSummary?.publisherAddress === "genesis" ? (
              <FitContentA>
                <Text type="p4" color="blue" className="ellipsis">
                  {realmSummary?.publisherAddress}
                </Text>
              </FitContentA>
            ) : (
              <FitContentA>
                <Link href={getUrlWithNetwork(`/account/${realmSummary?.publisherAddress}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {realmSummary?.publisherAddress || ""}
                  </Text>
                </Link>
              </FitContentA>
            )}
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Block Published</dt>
        <dd>
          <Badge>
            {realmSummary?.blockPublished === 0 ? (
              <FitContentA>
                <Text type="p4" color="blue" className="ellipsis">
                  {"-"}
                </Text>
              </FitContentA>
            ) : (
              <Link href={getUrlWithNetwork(`/block/${realmSummary?.blockPublished}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {realmSummary?.blockPublished}
                  </Text>
                </FitContentA>
              </Link>
            )}
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>
          Balance
          <div className="tooltip-wrapper">
            <Tooltip content={TOOLTIP_BALANCE}>
              <IconTooltip />
            </Tooltip>
          </div>
        </dt>
        <dd>
          <Badge>{balanceStr}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Calls</dt>
        <dd>
          <RealmTotalContractCalls realmTransactions={realmTransactions} isFetched={isFetchedRealmTransactionsData} />
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Fees Used</dt>
        <dd>
          <RealmTotalUsedFeeAmount
            realmTransactions={realmTransactions}
            isFetched={isFetchedRealmTransactionsData}
            getTokenAmount={getTokenAmount}
          />
        </dd>
      </DLWrap>
      {realmSummary?.files && <ShowLog isTabLog={true} files={realmSummary?.files} btnTextType="Realms" />}
    </DataSection>
  );
};

export default StandardNetworkRealmSummary;
