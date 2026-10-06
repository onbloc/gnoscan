import React from "react";
import Link from "next/link";

import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useRealm } from "@/common/hooks/realms/use-realm";
import { useNetwork } from "@/common/hooks/use-network";
import { useUsername } from "@/common/hooks/account/use-username";
import { useGetRealmTransactionsQuery } from "@/common/react-query/realm";

import DataSection from "../../details-data-section";
import { DLWrap, FitContentA, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import { Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { RealmTotalContractCalls } from "../realm-total-contract-calls/RealmTotalContractCalls";
import { RealmTotalUsedFeeAmount } from "../realm-total-used-fee-amount/RealmTotalUsedFeeAmount";
import PublicFunctions from "@/components/ui/public-functions";

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
  }, [getTokenAmount, summary]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <Field label="Name" isDesktop={isDesktop}>
        <Badge>{summary?.name}</Badge>
      </Field>
      <FieldWithTooltip
        label="Path"
        tooltipContent={TOOLTIP_PACKAGE_PATH}
        isDesktop={isDesktop}
        contentClassName="path-wrapper"
      >
        <Badge>
          <Text type="p4" color="reverse" className="ellipsis">
            {formatDisplayPackagePath(summary?.path)}
          </Text>

          <CopyTooltip variant="path" copyText={summary?.path} />
        </Badge>
      </FieldWithTooltip>
      <Field label="Realm Address" isDesktop={isDesktop}>
        <Badge>
          <Text type="p4" color="reverse" className="ellipsis">
            {summary?.realmAddress || ""}
          </Text>

          <CopyTooltip variant="path" copyText={summary?.realmAddress || ""} />
        </Badge>
      </Field>
      <DLWrap desktop={isDesktop}>
        <dt>Public Functions</dt>
        <PublicFunctions>
          {summary?.funcs?.map((v: string, index: number) => (
            <Badge key={index} type="blue">
              <Text type="p4" color="white">
                {v}
              </Text>
            </Badge>
          ))}
        </PublicFunctions>
      </DLWrap>
      <Field label="Publisher" isDesktop={isDesktop}>
        <Badge>
          {summary?.publisherAddress === "genesis" ? (
            <FitContentA>
              <Text type="p4" color="blue" className="ellipsis">
                {summary?.publisherAddress}
              </Text>
            </FitContentA>
          ) : (
            <FitContentSpan>
              <Link href={getUrlWithNetwork(`/account/${summary?.publisherAddress}`)} passHref>
                <Text type="p4" color="blue" className="ellipsis">
                  {getName(summary?.publisherAddress || "") || summary?.publisherAddress}
                </Text>
              </Link>
            </FitContentSpan>
          )}
        </Badge>
      </Field>
      <Field label="Block Published" isDesktop={isDesktop}>
        <Badge>
          {summary?.blockPublished === 0 ? (
            <FitContentA>
              <Text type="p4" color="blue" className="ellipsis">
                {"-"}
              </Text>
            </FitContentA>
          ) : (
            <Link href={getUrlWithNetwork(`/block/${summary?.blockPublished}`)} passHref>
              <FitContentSpan>
                <Text type="p4" color="blue">
                  {summary?.blockPublished}
                </Text>
              </FitContentSpan>
            </Link>
          )}
        </Badge>
      </Field>
      <FieldWithTooltip label="Balance" tooltipContent={TOOLTIP_BALANCE} isDesktop={isDesktop}>
        <Badge>{balanceStr}</Badge>
      </FieldWithTooltip>
      <Field label="Total Calls" isDesktop={isDesktop}>
        <RealmTotalContractCalls realmTransactions={realmTransactions} isFetched={isFetchedRealmTransactions} />
      </Field>
      <Field label="Total Fees Used" isDesktop={isDesktop}>
        <RealmTotalUsedFeeAmount
          realmTransactions={realmTransactions}
          isFetched={isFetchedRealmTransactions}
          getTokenAmount={getTokenAmount}
        />
      </Field>
      {summary?.files && <ShowLog isTabLog={true} files={summary?.files} btnTextType="Realms" />}
    </DataSection>
  );
};

export default CustomNetworkRealmSummary;
