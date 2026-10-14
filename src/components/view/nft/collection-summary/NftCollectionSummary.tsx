import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetNftCollection, useGetNftCollections } from "@/common/react-query/token/api";
import { formatDisplayPackagePath, makeDisplayNumber, makeDisplayNumberWithDefault } from "@/common/utils/string-util";

import Badge from "@/components/ui/badge";
import { AddressDisplayLink, Field } from "@/components/ui/detail-field";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import PublicFunctions from "@/components/ui/public-functions";
import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StyledA } from "../../token/token-summary/TokenSummary.styles";
import * as S from "./NftCollectionSummary.styles";

// Missing collection fields use a dash. Standard remains API-derived from the
// creation-event emitter; only its gno.land/ display prefix is omitted here.
const EMPTY_VALUE = "-";

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
    <S.SummaryContainer>
      <Text type="h6" desktopType="h4" color="primary" margin="0 0 16px 0" className="summary-title">
        Summary
      </Text>
      <Field label="Name">
        <Badge>{collection?.name || EMPTY_VALUE}</Badge>
      </Field>
      <Field label="Symbol">
        <Badge>{collection?.symbol || EMPTY_VALUE}</Badge>
      </Field>
      <Field label="Path">
        <Badge className="copyable-badge">
          <Text type="p4" color="blue" className="username-text">
            <StyledA href={getUrlWithNetwork(`/realms/details?path=${collection?.path}`)}>
              {formatDisplayPackagePath(collection?.path)}
            </StyledA>
          </Text>
          <CopyTooltip variant="path" copyText={collection?.path} />
        </Badge>
      </Field>
      <Field label="NFT Standard">
        <Badge>{collection?.standardPackage?.replace(/^gno\.land\//, "") || EMPTY_VALUE}</Badge>
      </Field>
      <DLWrap className="public-functions">
        <dt>Public Functions</dt>
        <PublicFunctions>
          {(collection?.funcTypesList ?? []).map(functionName => (
            <Badge type="blue" key={functionName}>
              <Text type="p4" color="white" fontWeight={600}>
                {functionName}
              </Text>
            </Badge>
          ))}
        </PublicFunctions>
      </DLWrap>
      <Field label="Creator">
        <Badge className="copyable-badge">
          <AddressDisplayLink
            address={collection?.owner}
            name={collection?.ownerName}
            label={collection?.ownerLabel}
            labelType={collection?.ownerLabelType}
            getUrlWithNetwork={getUrlWithNetwork}
          />
          {collection?.owner && <CopyTooltip variant="path" copyText={collection.owner} />}
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
      {files.length > 0 && (
        <S.SourceArea>
          <ShowLog isTabLog={true} files={files} btnTextType="Source" />
        </S.SourceArea>
      )}
    </S.SummaryContainer>
  );
};

export default NftCollectionSummary;
