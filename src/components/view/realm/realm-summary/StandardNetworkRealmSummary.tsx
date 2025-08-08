import Link from "next/link";
import React from "react";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { NonMobile } from "@/common/hooks/use-media";
import { useNetwork } from "@/common/hooks/use-network";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";
import { useGetRealmByPath } from "@/common/react-query/realm/api";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { makeTemplate } from "@/common/utils/template.utils";
import {
  GNOSTUDIO_REALM_FUNCTION_TEMPLATE,
  GNOSTUDIO_REALM_TEMPLATE,
  GNOWEB_REALM_TEMPLATE,
} from "@/common/values/url.constant";
import { Amount, RealmSummary } from "@/types/data-type";

import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import { formatDisplayBlockHeight } from "@/common/utils/block.utility";
import { GNO_NETWORK_PREFIXES } from "@/common/values/gno.constant";
import Badge from "@/components/ui/badge";
import { DLWrap, FitContentA, LinkWrapper } from "@/components/ui/detail-page-common-styles";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import Tooltip from "@/components/ui/tooltip";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import DataSection from "../../details-data-section";
import { StorageDepositText } from "@/components/ui/text/storage-deposit-text";

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

const StandardNetworkRealmSummary = ({ path, isDesktop }: RealmSummaryProps) => {
  const { currentNetwork, gnoWebUrl, getUrlWithNetwork } = useNetwork();

  const { data: realmData, isFetched: isFetchedRealmData } = useGetRealmByPath(path);

  const realmSummary: RealmSummary | null = React.useMemo(() => {
    if (!realmData?.data) return null;

    return RealmMapper.realmSummaryFromApiResponse(realmData.data);
  }, [realmData?.data]);

  const realmBalance: Amount | null = React.useMemo(() => {
    if (!realmSummary?.balance) return null;

    const data = realmSummary.balance;
    return toGNOTAmount(data.value, data.denom);
  }, [realmSummary?.balance]);

  const realmTotalUsedFees: Amount | null = React.useMemo(() => {
    if (!realmSummary?.totalUsedFees) return null;

    const data = realmSummary.totalUsedFees;
    return toGNOTAmount(data?.value, data?.denom);
  }, [realmSummary?.totalUsedFees]);

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

  const displayBlockPublished = React.useMemo(() => {
    return formatDisplayBlockHeight(realmSummary?.blockPublished);
  }, [realmSummary?.blockPublished]);

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
            {hasGnoWebUrl && (
              <LinkWrapper onClick={moveGnoWeb}>
                <Text type="p4" className="ellipsis">
                  Go to Gnoweb
                </Text>
                <IconLink className="icon-link" />
              </LinkWrapper>
            )}

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
        <dt>Public Functions</dt>
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
                  {realmSummary?.publisherName || realmSummary?.publisherAddress || ""}
                </Text>
              </FitContentA>
            ) : (
              <FitContentA>
                <Link href={getUrlWithNetwork(`/account/${realmSummary?.publisherAddress}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {realmSummary?.publisherName || realmSummary?.publisherAddress || ""}
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
            {realmSummary?.blockPublished == null ? (
              <FitContentA>
                <Text type="p4" color="blue" className="ellipsis">
                  {"-"}
                </Text>
              </FitContentA>
            ) : (
              <Link href={getUrlWithNetwork(`/block/${realmSummary?.blockPublished}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {displayBlockPublished}
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
          <Badge>
            <AmountText
              minSize="body1"
              maxSize="p4"
              value={realmBalance?.value || "0"}
              denom={realmBalance?.denom || GNOTToken.symbol}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Calls</dt>
        <dd>
          <Badge>{realmSummary?.contractCalls || 0}</Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>Total Fees Used</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body1"
              maxSize="p4"
              value={realmTotalUsedFees?.value || "0"}
              denom={realmTotalUsedFees?.denom || GNOTToken.symbol}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop}>
        <dt>
          Storage Deposit
          <div className="tooltip-wrapper">
            <Tooltip content={TOOLTIP_STORAGE_DEPOSIT}>
              <IconTooltip />
            </Tooltip>
          </div>
        </dt>
        <dd>
          <Badge>
            <StorageDepositText
              minSize="body1"
              maxSize="p4"
              value={realmTotalUsedFees?.value || "0"}
              denom={realmTotalUsedFees?.denom || GNOTToken.symbol}
              sizeInBytes={16302}
              visibleStorageSize={true}
              visibleTooltip={false}
            />
          </Badge>
        </dd>
      </DLWrap>
      {realmSummary?.files && <ShowLog isTabLog={true} files={realmSummary?.files} btnTextType="Realms" />}
    </DataSection>
  );
};

export default StandardNetworkRealmSummary;
