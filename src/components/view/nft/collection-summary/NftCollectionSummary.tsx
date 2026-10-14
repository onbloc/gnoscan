import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetNftCollection, useGetNftCollections } from "@/common/react-query/token/api";
import { formatDisplayPackagePath, makeDisplayNumber, makeDisplayNumberWithDefault } from "@/common/utils/string-util";

import Badge from "@/components/ui/badge";
import { AddressDisplayLink, Field, FieldWithTooltip } from "@/components/ui/detail-field";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import PublicFunctions from "@/components/ui/public-functions";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import DataSection from "@/components/view/details-data-section";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StyledA } from "../../token/token-summary/TokenSummary.styles";

// Missing collection fields use a dash; Standard comes from the creation-event emitter.
const EMPTY_VALUE = "-";

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

interface NftCollectionSummaryProps {
  tokenKey: string;
}

const NftCollectionSummary = ({ tokenKey }: NftCollectionSummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const { data, isFetched } = useGetNftCollection(tokenKey);
  const collection = data?.data;
  // The detail API has no transfer count; the list API filtered to this realm does.
  const { data: listData } = useGetNftCollections({ packagePath: collection?.path }, { enabled: !!collection?.path });
  const transfers = listData?.items.find(item => item.tokenId === collection?.tokenId)?.transfers;

  const files = React.useMemo(
    () => collection?.sourceFiles?.map(file => ({ name: file.filename ?? "", body: file.content ?? "" })) ?? [],
    [collection?.sourceFiles],
  );

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataSection title="Summary">
      <Field label="Name">
        <Badge>{collection?.name || EMPTY_VALUE}</Badge>
      </Field>
      <Field label="Symbol">
        <Badge>{collection?.symbol || EMPTY_VALUE}</Badge>
      </Field>
      <FieldWithTooltip label="Path" tooltipContent={TOOLTIP_PACKAGE_PATH}>
        <Badge>
          <Text type="p4" color="blue" className="username-text">
            <StyledA href={getUrlWithNetwork(`/realms/details?path=${collection?.path}`)}>
              {formatDisplayPackagePath(collection?.path)}
            </StyledA>
          </Text>
          <CopyTooltip variant="path" copyText={collection?.path} />
        </Badge>
      </FieldWithTooltip>
      <Field label="NFT Standard">
        <Badge>{collection?.standardPackage || EMPTY_VALUE}</Badge>
      </Field>
      <DLWrap>
        <dt>Public Functions</dt>
        <PublicFunctions>
          {(collection?.funcTypesList ?? []).map(functionName => (
            <Badge type="blue" key={functionName}>
              <Text type="p4" color="white">
                {functionName}
              </Text>
            </Badge>
          ))}
        </PublicFunctions>
      </DLWrap>
      <Field label="Creator">
        <Badge>
          <AddressDisplayLink
            address={collection?.owner}
            name={collection?.ownerName}
            label={collection?.ownerLabel}
            labelType={collection?.ownerLabelType}
            getUrlWithNetwork={getUrlWithNetwork}
          />
        </Badge>
      </Field>
      <Field label="Total Supply">
        <Badge>{makeDisplayNumber(collection?.totalSupply || 0)}</Badge>
      </Field>
      <Field label="Holders">
        <Badge>{makeDisplayNumber(collection?.holders || 0)}</Badge>
      </Field>
      <Field label="Transfers">
        <Badge>{makeDisplayNumberWithDefault(transfers)}</Badge>
      </Field>
      {files.length > 0 && <ShowLog isTabLog={true} files={files} btnTextType="Source" />}
    </DataSection>
  );
};

export default NftCollectionSummary;
