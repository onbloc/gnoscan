import BigNumber from "bignumber.js";
import Link from "next/link";
import React from "react";
import { css } from "styled-components";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { useGetNativeTokenBalance } from "@/common/react-query/account";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { useGetRealmByPath } from "@/common/react-query/realm/api";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { makeTemplate } from "@/common/utils/template.utils";
import { TOOLTIP_NOT_YET_ENABLED } from "@/common/values/tooltip-content.constant";
import { GNOWEB_REALM_TEMPLATE } from "@/common/values/url.constant";
import { Amount, RealmSummary } from "@/types/data-type";

import { mapAccountAssetsToAmounts, sortAmountsByValueDesc, TokenAmount } from "./realm-balance.utility";

import IconLink from "@/assets/svgs/icon-link.svg";
import { useGetRealmStorageDepositByPath } from "@/common/react-query/realm/api/use-get-realm-storage-deposit-by-path";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";
import { GNO_NETWORK_PREFIXES } from "@/common/values/gno.constant";
import Badge from "@/components/ui/badge";
import { AddressDisplayLink, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { DLWrap, FitContentA, FitContentSpan, LinkWrapper } from "@/components/ui/detail-page-common-styles";
import FloatingTooltip from "@/components/ui/floating-tooltip";
import IconInfo from "@/components/ui/icon-info";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import { StorageDepositText } from "@/components/ui/text/storage-deposit-text";
import { UsdValueText } from "@/components/ui/text/usd-value-text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import DataSection from "../../details-data-section";
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

const TOOLTIP_STORAGE_DEPOSIT = <>Total amount of GNOT deposited for storage in real time.</>;

const notYetEnabledBadgeStyle = css`
  background-color: #ff4d4f;

  .not-yet-enabled-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .not-yet-enabled-tooltip {
    width: 16px;
    height: 16px;
    line-height: 0;
  }
`;

const NotYetEnabledBadge = () => (
  <Badge margin="0" cssExtend={notYetEnabledBadgeStyle}>
    <span className="not-yet-enabled-content">
      <Text type="p4" color="white" fontWeight={400}>
        Not Yet Enabled
      </Text>
      <FloatingTooltip
        content={TOOLTIP_NOT_YET_ENABLED}
        className="not-yet-enabled-tooltip"
        ariaLabel="Show not yet enabled details"
      >
        <IconInfo size={16} fill="#ffffff" />
      </FloatingTooltip>
    </span>
  </Badge>
);

const StandardNetworkRealmSummary = ({ path, isDesktop }: RealmSummaryProps) => {
  const { gnoWebUrl, getUrlWithNetwork } = useNetwork();

  const { data: realmData, isFetched: isFetchedRealmData } = useGetRealmByPath(path);
  const { data: storageDepositData } = useGetRealmStorageDepositByPath(path);
  const realmResponseData = realmData?.data;

  const realmSummary: RealmSummary | null = React.useMemo(() => {
    if (!realmResponseData) return null;

    return RealmMapper.realmSummaryFromApiResponse(realmResponseData);
  }, [realmResponseData]);

  const { data: nativeBalanceData } = useGetNativeTokenBalance(realmSummary?.realmAddress || "", {
    enabled: !!realmSummary?.realmAddress,
  });
  const { data: accountData } = useGetAccountByAddress(realmSummary?.realmAddress || "", {
    enabled: !!realmSummary?.realmAddress,
  });

  const { getTokenMeta } = useTokenResourceMeta();
  const realmBalanceList: TokenAmount[] = React.useMemo(() => {
    const nativeDenom = nativeBalanceData?.denom || GNOTToken.denom;
    const nativeAmount = { ...toGNOTAmount(nativeBalanceData?.value || "0", nativeDenom), tokenKey: nativeDenom };
    const amounts = [nativeAmount, ...mapAccountAssetsToAmounts(accountData?.data?.assets, getTokenMeta)];
    return sortAmountsByValueDesc(amounts.filter(amount => !BigNumber(amount.value).isZero()));
  }, [nativeBalanceData, accountData?.data?.assets, getTokenMeta]);

  const realmTotalUsedFees: Amount | null = React.useMemo(() => {
    if (!realmSummary?.totalUsedFees) return null;

    const data = realmSummary.totalUsedFees;
    return toGNOTAmount(data?.value, data?.denom);
  }, [realmSummary]);

  const displayStorageDepositAmount: Amount = React.useMemo(() => {
    if (!storageDepositData)
      return {
        value: "0",
        denom: GNOTToken.denom,
      };

    const converted = toGNOTAmount(storageDepositData.deposit, GNOTToken.denom);
    return converted;
  }, [storageDepositData]);

  const hasGnoWebUrl = React.useMemo(() => {
    return gnoWebUrl !== null && gnoWebUrl !== "";
  }, [gnoWebUrl]);

  const moveGnoWeb = React.useCallback(() => {
    if (!gnoWebUrl) {
      return;
    }

    const packagePostPath = path.startsWith(GNO_NETWORK_PREFIXES.GNO_LAND)
      ? path.replace(GNO_NETWORK_PREFIXES.GNO_LAND, "")
      : path;

    const url = makeTemplate(GNOWEB_REALM_TEMPLATE, {
      GNOWEB_URL: gnoWebUrl,
      PACKAGE_POST_PATH: packagePostPath,
    });
    window.open(url, "_blank");
  }, [path, gnoWebUrl]);

  const displayBlockPublished = React.useMemo(() => {
    return formatDisplayBlockHeight(realmSummary?.blockPublished);
  }, [realmSummary?.blockPublished]);

  const isRealmNotEnabled = realmSummary?.isEnableYn === "N";

  if (!isFetchedRealmData) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <Field label="Name" isDesktop={isDesktop}>
        <Badge>{realmSummary?.name}</Badge>
      </Field>
      <FieldWithTooltip
        label="Path"
        tooltipContent={TOOLTIP_PACKAGE_PATH}
        isDesktop={isDesktop}
        contentClassName="path-wrapper"
      >
        <Badge margin="0">
          <Text type="p4" color="reverse" className="ellipsis">
            {formatDisplayPackagePath(realmSummary?.path)}
          </Text>

          <CopyTooltip variant="path" copyText={realmSummary?.path} />
        </Badge>

        {isRealmNotEnabled && <NotYetEnabledBadge />}

        {hasGnoWebUrl && (
          <LinkWrapper className="hide-mobile" onClick={moveGnoWeb}>
            <Text type="p4" className="ellipsis">
              Go to Gnoweb
            </Text>
            <IconLink className="icon-link" />
          </LinkWrapper>
        )}
      </FieldWithTooltip>
      <Field label="Realm Address" isDesktop={isDesktop}>
        <Badge>
          <Text type="p4" color="reverse" className="ellipsis">
            {realmSummary?.realmAddress || ""}
          </Text>

          <CopyTooltip variant="path" copyText={realmSummary?.realmAddress || ""} />
        </Badge>
      </Field>
      <DLWrap desktop={isDesktop}>
        <dt>Public Functions</dt>
        <PublicFunctions>
          {realmSummary?.funcs?.map((v: string, index: number) => (
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
          {realmSummary?.publisherAddress === "genesis" ? (
            <FitContentA>
              <Text type="p4" color="blue" className="ellipsis">
                {getAddressDisplayText({
                  address: realmSummary?.publisherAddress,
                  name: realmSummary?.publisherName,
                  label: realmSummary?.publisherLabel,
                }) || ""}
              </Text>
            </FitContentA>
          ) : (
            <AddressDisplayLink
              address={realmSummary?.publisherAddress}
              name={realmSummary?.publisherName}
              label={realmSummary?.publisherLabel}
              labelType={realmSummary?.publisherLabelType}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
        </Badge>
      </Field>
      <Field label="Block Published" isDesktop={isDesktop}>
        <Badge>
          {realmSummary?.blockPublished == null ? (
            <FitContentA>
              <Text type="p4" color="blue" className="ellipsis">
                {"-"}
              </Text>
            </FitContentA>
          ) : (
            <Link href={getUrlWithNetwork(`/block/${realmSummary?.blockPublished}`)} passHref>
              <FitContentSpan>
                <Text type="p4" color="blue">
                  {displayBlockPublished}
                </Text>
              </FitContentSpan>
            </Link>
          )}
        </Badge>
      </Field>
      <FieldWithTooltip
        label="Balance"
        tooltipContent={TOOLTIP_BALANCE}
        isDesktop={isDesktop}
        contentClassName="function-wrapper"
      >
        {realmBalanceList.length > 0 ? (
          realmBalanceList.map((amount, index) => (
            <Badge key={`${amount.denom}-${index}`}>
              <AmountText minSize="body1" maxSize="p4" denomSize="body2" value={amount.value} denom={amount.denom} />
              <UsdValueText tokenKey={amount.tokenKey} amount={amount.value} />
            </Badge>
          ))
        ) : (
          <Badge>-</Badge>
        )}
      </FieldWithTooltip>
      <Field label="Total Calls" isDesktop={isDesktop}>
        <Badge>{realmSummary?.contractCalls || 0}</Badge>
      </Field>
      <Field label="Total Fees Used" isDesktop={isDesktop}>
        <Badge>
          <AmountText
            minSize="body1"
            maxSize="p4"
            denomSize="body2"
            value={realmTotalUsedFees?.value || "0"}
            denom={realmTotalUsedFees?.denom || GNOTToken.symbol}
          />
          <UsdValueText tokenKey={GNOTToken.denom} amount={realmTotalUsedFees?.value || "0"} />
        </Badge>
      </Field>
      <FieldWithTooltip label="Storage Deposit" tooltipContent={TOOLTIP_STORAGE_DEPOSIT} isDesktop={isDesktop}>
        <Badge>
          <StorageDepositText
            minSize="body1"
            maxSize="p4"
            denomSize="body1"
            value={displayStorageDepositAmount.value}
            denom={displayStorageDepositAmount.denom}
            sizeInBytes={storageDepositData?.storage || 0}
            visibleStorageSize={true}
            visibleTooltip={false}
          />
          <UsdValueText tokenKey={GNOTToken.denom} amount={displayStorageDepositAmount.value} />
        </Badge>
      </FieldWithTooltip>
      {realmSummary?.files && <ShowLog isTabLog={true} files={realmSummary?.files} btnTextType="Realms" />}
    </DataSection>
  );
};

export default StandardNetworkRealmSummary;
