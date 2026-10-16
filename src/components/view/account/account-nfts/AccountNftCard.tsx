/* eslint-disable react-hooks/refs */
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClientPoint,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import React from "react";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetNftItemDetail } from "@/common/react-query/token/api";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { isGnftPackagePath, stripGnoLandPrefix } from "@/common/utils/token.utility";
import { makeNftTokenHash } from "@/common/utils/nft-token-hash.utility";
import { isStakedNft } from "@/common/utils/nft-staking.utility";
import { gnoswapPositionUrl } from "@/common/utils/gnoswap-link.utility";
import { zindex } from "@/common/values/z-index";
import { AccountGRC721CollectionItemModel } from "@/repositories/api/account/response";
import PathText from "@/components/ui/path-text/PathText";

import IconLink from "@/assets/svgs/icon-link.svg";
import NftCard from "../../nft/nft-card/NftCard";
import * as S from "./AccountNfts.styles";

interface AccountNftCardProps {
  nft: AccountGRC721CollectionItemModel;
  imageUrl?: string;
  imageLoading?: boolean;
}

const AccountNftCard = ({ nft, imageUrl, imageLoading }: AccountNftCardProps) => {
  const { getUrlWithNetwork, gnoWebUrl } = useNetwork();
  const isGnft = isGnftPackagePath(nft.tokenId);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  // The tooltip describes the card click, so it hides over the secondary external link.
  const [isOverGnoWebLink, setIsOverGnoWebLink] = React.useState(false);
  const activity = useGetNftItemDetail(nft.tokenId, nft.nftId, {
    enabled: isTooltipOpen && !isOverGnoWebLink,
  });
  const lastTransferTime = activity.data?.data.lastTransferBlockTime;
  const lastMintTime = activity.data?.data.lastMintBlockTime;
  const position = nft.position;
  const positionUrl =
    isGnft && position
      ? gnoswapPositionUrl(position.poolPath, nft.nftId, isStakedNft(nft) ? nft.operatorAddress : nft.ownerAddress)
      : null;

  const { x, y, strategy, refs, context } = useFloating({
    open: isTooltipOpen,
    onOpenChange: setIsTooltipOpen,
    placement: "bottom-start",
    middleware: [offset({ mainAxis: 16, crossAxis: 12 }), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const clientPoint = useClientPoint(context);
  // Mouse only: touch taps navigate straight away.
  const hover = useHover(context, { mouseOnly: true });
  const { getReferenceProps, getFloatingProps } = useInteractions([clientPoint, hover]);

  const realmPath = stripGnoLandPrefix(nft.packagePath);
  // Opens the collection page on its Inventory tab with this token's detail panel. The canonical collection
  // token ID is used because the API does not resolve GRC721 collections by "path.SYMBOL".
  // The hash goes after the network query that getUrlWithNetwork appends.
  const tokenDetailUrl = `${getUrlWithNetwork(`/tokens/${nft.tokenId}`)}${makeNftTokenHash(nft.nftId)}`;
  const gnoWebLinkProps = gnoWebUrl
    ? {
        as: "a" as const,
        href: `${gnoWebUrl}/${realmPath}`,
        target: "_blank",
        rel: "noopener noreferrer",
        onMouseEnter: () => setIsOverGnoWebLink(true),
        onMouseLeave: () => setIsOverGnoWebLink(false),
      }
    : {};

  return (
    <>
      {/* The card link is stretched over the card so the gno.web link can sit above it instead of nesting anchors. */}
      <S.CardItem ref={refs.setReference} {...getReferenceProps()}>
        <NftCard
          nftId={nft.nftId}
          symbol={nft.symbol}
          imageUrl={imageUrl}
          imageLoading={imageLoading}
          staked={isStakedNft(nft)}
          burned={nft.position?.burned === true}
        >
          <S.CollectionRow $position={!!positionUrl}>
            {positionUrl ? (
              <S.PositionLink
                as="a"
                href={positionUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View Position #${nft.nftId} on GnoSwap`}
                onMouseEnter={() => setIsOverGnoWebLink(true)}
                onMouseLeave={() => setIsOverGnoWebLink(false)}
              >
                <S.CollectionPathText type="p4" color="gray300">
                  View Position
                </S.CollectionPathText>
                <IconLink className="icon-link" />
              </S.PositionLink>
            ) : (
              <S.CollectionPath {...gnoWebLinkProps}>
                <S.CollectionPathText type="p4" color="gray300">
                  <PathText path={realmPath} suffix={gnoWebUrl ? <IconLink className="icon-link" /> : undefined} />
                </S.CollectionPathText>
              </S.CollectionPath>
            )}
            <S.CollectionName type="p4" color="gray300">
              {nft.name}
            </S.CollectionName>
          </S.CollectionRow>
        </NftCard>
        <S.CardLink href={tokenDetailUrl} aria-label={`${nft.name} Token #${nft.nftId}`} />
      </S.CardItem>
      {isTooltipOpen && !isOverGnoWebLink && (
        <FloatingPortal>
          <S.Tooltip
            ref={refs.setFloating}
            role="tooltip"
            style={{ position: strategy, top: y ?? 0, left: x ?? 0, zIndex: zindex.modal + 1 }}
            {...getFloatingProps()}
          >
            <S.TooltipTitle>
              {nft.name} · Token #{nft.nftId}
            </S.TooltipTitle>
            <S.TooltipDetail>
              {activity.isError ? (
                "Activity unavailable"
              ) : (
                <>
                  <span title={lastTransferTime ?? undefined}>
                    Last Transfer {activity.isLoading ? "Loading…" : formatNftRelativeTime(lastTransferTime)}
                  </span>
                  {"  ·  "}
                  <span title={lastMintTime ?? undefined}>
                    Minted {activity.isLoading ? "Loading…" : formatNftRelativeTime(lastMintTime)}
                  </span>
                </>
              )}
            </S.TooltipDetail>
            <S.TooltipHint>Click to open the collection for details</S.TooltipHint>
          </S.Tooltip>
        </FloatingPortal>
      )}
    </>
  );
};

export default AccountNftCard;
