import React from "react";
import Link from "next/link";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { Amount, Transaction } from "@/types/data-type";
import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useRealm } from "@/common/hooks/realms/use-realm";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";
import { useGetRealmTransactionsQuery } from "@/common/react-query/realm";

import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import DataSection from "../../details-data-section";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Tooltip from "@/components/ui/tooltip";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { RealmTotalContractCalls } from "../realm-total-contract-calls/RealmTotalContractCalls";
import { RealmTotalUsedFeeAmount } from "../realm-total-used-fee-amount/RealmTotalUsedFeeAmount";

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

const CustomNetworkRealmSummary = ({ path, isDesktop }: RealmSummaryProps) => {
  const { summary, isFetched } = useRealm(path);
  const { data: realmTransactions, isFetched: isFetchedRealmTransactions } = useGetRealmTransactionsQuery(path);
  const { getUrlWithNetwork } = useNetwork();
  const { getName } = useUsername();
  const { getTokenAmount } = useTokenMeta();

  const balanceStr = React.useMemo(() => {
    if (!summary?.balance) {
      return "-";
    }
    const amount = getTokenAmount(GNOTToken.denom, summary.balance.value);
    return `${amount.value} ${amount.denom}`;
  }, [getTokenAmount, summary?.balance]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <DLWrap desktop={isDesktop}>
        <dt>Name</dt>
        <dd>
          <Badge>{summary?.name}</Badge>
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
              {formatDisplayPackagePath(summary?.path)}
            </Text>

            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={summary?.path}
              width={85}
            >
              <IconCopy className="svg-icon" />
            </Tooltip>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Realm Address</dt>
        <dd>
          <Badge>
            <Text type="p4" color="reverse" className="ellipsis">
              {summary?.realmAddress || ""}
            </Text>

            <Tooltip
              className="path-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={summary?.realmAddress || ""}
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
          {summary?.funcs?.map((v: string, index: number) => (
            <Badge key={index} type="blue">
              <Text type="p4" color="white">
                {v}
              </Text>
            </Badge>
          ))}
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Publisher</dt>
        <dd>
          <Badge>
            {summary?.publisherAddress === "genesis" ? (
              <FitContentA>
                <Text type="p4" color="blue" className="ellipsis">
                  {summary?.publisherAddress}
                </Text>
              </FitContentA>
            ) : (
              <FitContentA>
                <Link href={getUrlWithNetwork(`/account/${summary?.publisherAddress}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {getName(summary?.publisherAddress || "") || summary?.publisherAddress}
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
            {summary?.blockPublished === 0 ? (
              <FitContentA>
                <Text type="p4" color="blue" className="ellipsis">
                  {"-"}
                </Text>
              </FitContentA>
            ) : (
              <Link href={getUrlWithNetwork(`/block/${summary?.blockPublished}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {summary?.blockPublished}
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
          <RealmTotalContractCalls realmTransactions={realmTransactions} isFetched={isFetchedRealmTransactions} />
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Fees Used</dt>
        <dd>
          <RealmTotalUsedFeeAmount
            realmTransactions={realmTransactions}
            isFetched={isFetchedRealmTransactions}
            getTokenAmount={getTokenAmount}
          />
        </dd>
      </DLWrap>
      {summary?.files && <ShowLog isTabLog={true} files={summary?.files} btnTextType="Realms" />}
    </DataSection>
  );
};

export default CustomNetworkRealmSummary;
