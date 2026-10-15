import React from "react";
import dayjs from "dayjs";
import Link from "next/link";

import { useGetNftItemDetail, useGetNftItemTransfers, useGetNftTokenDetail } from "@/common/react-query/token/api";
import { DEVICE_SIZE_THRESHOLDS } from "@/common/values/ui.constant";
import { isStakedNft } from "@/common/utils/nft-staking.utility";
import { useNetwork } from "@/common/hooks/use-network";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { makeDisplayNumber, textEllipsis } from "@/common/utils/string-util";
import { isGnftPackagePath, stripGnoLandPrefix } from "@/common/utils/token.utility";
import { nftArtwork, nftMediaUrl } from "@/common/utils/nft-media.utility";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { base64HashToHex, isBase64Hash } from "@/common/utils/transaction.utility";
import { NftCollectionItemModel } from "@/repositories/api/token/response";

import IconArrow from "@/assets/svgs/icon-arrow.svg";
import IconClose from "@/assets/svgs/icon-close.svg";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import IconLink from "@/assets/svgs/icon-link.svg";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { Pagination } from "@/components/ui/pagination";
import Tooltip from "@/components/ui/tooltip";
import { DatatableItem } from "../../datatable";
import StakedBadge from "../staked-badge/StakedBadge";
import NftImage from "../nft-image/NftImage";
import NftPositionInfo from "./NftPositionInfo";
import * as S from "./NftTokenPanel.styles";

const EMPTY_VALUE = "-";
const TRANSFERS_PAGE_SIZE = 5;

const PANEL_TRANSITION_MS = 400;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface NftTokenPanelProps {
  nftId: string;
  tokenKey: string;
  standardPackage: string | null;
  packagePath: string;
  symbol: string;
  // The NFT's inventory row when it is among the loaded items; owner comes from it
  item: NftCollectionItemModel | null;
  previousNftId: string | null;
  nextNftId: string | null;
  open?: boolean;
  onExited?: () => void;
  onSelect: (nftId: string) => void;
  onClose: () => void;
}

const NftTokenPanel = ({
  nftId,
  tokenKey,
  standardPackage,
  packagePath,
  symbol,
  item,
  previousNftId,
  nextNftId,
  open = true,
  onExited,
  onSelect,
  onClose,
}: NftTokenPanelProps) => {
  const title = `Token #${nftId}`;
  const staked = !!item && isStakedNft(item);
  const { getUrlWithNetwork } = useNetwork();
  const { data: detail, isLoading, isArtworkLoading } = useGetNftTokenDetail(packagePath, nftId);
  const indexedQuery = useGetNftItemDetail(tokenKey, nftId, { keepPreviousData: false });
  const transferIdentity = `${tokenKey}:${nftId}`;
  const [transferPagination, setTransferPagination] = React.useState({ identity: transferIdentity, page: 1 });
  const transferPage = transferPagination.identity === transferIdentity ? transferPagination.page : 1;
  if (transferPagination.identity !== transferIdentity) {
    setTransferPagination({ identity: transferIdentity, page: 1 });
  }
  // Keep latest-transfer information independent of the visible history page.
  const firstTransfersQuery = useGetNftItemTransfers(
    { tokenKey, nftId, page: 1, limit: TRANSFERS_PAGE_SIZE },
    { keepPreviousData: false },
  );
  const transfersQuery = useGetNftItemTransfers(
    { tokenKey, nftId, page: transferPage, limit: TRANSFERS_PAGE_SIZE },
    { keepPreviousData: false },
  );
  const totalTransferPages = Math.max(
    1,
    Math.ceil(
      (transfersQuery.data?.page.totalCount ?? firstTransfersQuery.data?.page.totalCount ?? 0) / TRANSFERS_PAGE_SIZE,
    ),
  );
  const changeTransferPage = (page: number) => {
    setTransferPagination({ identity: transferIdentity, page: Math.min(Math.max(page, 1), totalTransferPages) });
  };
  const indexedDetail = indexedQuery.data?.data;
  const transfers = transfersQuery.data?.items ?? [];
  const lastTransfer = firstTransfersQuery.data?.items.find(
    transfer =>
      transfer.fromAddress && transfer.toAddress && transfer.blockTime === indexedDetail?.lastTransferBlockTime,
  );
  const mintHash = indexedDetail?.lastMintTransactionHash;
  const displayMintHash = mintHash && (isBase64Hash(mintHash) ? base64HashToHex(mintHash) : mintHash);
  const metadata = detail?.metadataStatus === "found" ? detail.metadata : null;
  const attributes = metadata?.attributes ?? [];
  const tokenUrl = detail?.status === "found" ? detail.uri : "";
  const tokenLink = nftMediaUrl(tokenUrl);
  const panelRef = React.useRef<HTMLElement>(null);
  const onExitedRef = React.useRef(onExited);
  const finishExitRef = React.useRef<(() => void) | null>(null);
  const [visible, setVisible] = React.useState(false);
  const interactive = open && visible;

  useIsomorphicLayoutEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (interactive) {
      panel.removeAttribute("inert");
    } else {
      const focusedElement = document.activeElement;
      if (focusedElement instanceof HTMLElement && panel.contains(focusedElement)) {
        focusedElement.blur();
      }
      // React 18 does not type the inert attribute; apply it before paint.
      panel.setAttribute("inert", "");
    }
  }, [interactive]);

  // Below desktop the panel is a modal bottom sheet; keep the page behind it from scrolling.
  React.useEffect(() => {
    if (!interactive) return;
    const sheet = window.matchMedia(`(max-width: ${DEVICE_SIZE_THRESHOLDS.DESKTOP - 1}px)`);
    let previousOverflow: string | null = null;
    const sync = () => {
      if (sheet.matches && previousOverflow === null) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      } else if (!sheet.matches && previousOverflow !== null) {
        document.body.style.overflow = previousOverflow;
        previousOverflow = null;
      }
    };
    sync();
    sheet.addEventListener("change", sync);
    return () => {
      sheet.removeEventListener("change", sync);
      if (previousOverflow !== null) document.body.style.overflow = previousOverflow;
    };
  }, [interactive]);

  useIsomorphicLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let exited = false;
    let firstFrame: number | undefined;
    let secondFrame: number | undefined;
    let exitTimer: number | undefined;

    const finishExit = () => {
      if (cancelled || exited) return;
      exited = true;
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      onExitedRef.current?.();
    };

    if (open) {
      if (reducedMotion.matches) {
        setVisible(true);
      } else {
        // Paint the mounted closed state before transitioning into view.
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => setVisible(true));
        });
      }
    } else {
      setVisible(false);
      finishExitRef.current = finishExit;
      // Covers reduced motion, interrupted transitions and missing transition events.
      exitTimer = window.setTimeout(finishExit, reducedMotion.matches ? 0 : PANEL_TRANSITION_MS + 50);
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      if (firstFrame !== undefined) window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame);
      if (open) setVisible(true);
      else finishExit();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      finishExitRef.current = null;
      if (firstFrame !== undefined) window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [open]);

  const onTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (
      !open &&
      event.target === event.currentTarget &&
      event.propertyName === "opacity" &&
      window.getComputedStyle(event.currentTarget).opacity === "0"
    ) {
      finishExitRef.current?.();
    }
  };

  return (
    <>
      <S.Backdrop
        $visible={visible}
        $interactive={interactive}
        aria-hidden="true"
        onClick={interactive ? onClose : undefined}
      />
      <S.Panel
        ref={panelRef}
        $visible={visible}
        $interactive={interactive}
        aria-label={`${title} details`}
        aria-hidden={!interactive}
        onTransitionEnd={onTransitionEnd}
      >
        <S.Header>
          <S.HeaderButtons>
            <S.IconButton
              type="button"
              aria-label="Previous token"
              disabled={!previousNftId}
              onClick={() => previousNftId && onSelect(previousNftId)}
            >
              <IconArrow className="icon-fill icon-previous" />
            </S.IconButton>
            <S.IconButton
              type="button"
              aria-label="Next token"
              disabled={!nextNftId}
              onClick={() => nextNftId && onSelect(nextNftId)}
            >
              <IconArrow className="icon-fill" />
            </S.IconButton>
          </S.HeaderButtons>
          <S.TitleArea>
            <S.Title>{title}</S.Title>
            {symbol && <S.SymbolBadge>{symbol}</S.SymbolBadge>}
            {staked && <StakedBadge size="inline" />}
          </S.TitleArea>
          <S.HeaderButtons>
            <Tooltip
              content="Copied!"
              trigger="click"
              copyText={typeof window === "undefined" ? "" : window.location.href}
            >
              <S.IconButton as="span" role="button" aria-label="Copy token URL">
                <IconCopy className="icon-stroke" viewBox="0 0 16 16" width={14} height={14} />
              </S.IconButton>
            </Tooltip>
            <S.IconButton type="button" aria-label="Close token details" onClick={onClose}>
              <IconClose className="icon-stroke icon-close" />
            </S.IconButton>
          </S.HeaderButtons>
        </S.Header>

        {/* Keep the shared fallback artwork; panel-local styling rounds both loaded and failed images. */}
        <NftImage
          className="token-artwork"
          src={nftArtwork(metadata, tokenUrl) ?? nftMediaUrl(detail?.image)}
          isLoading={isArtworkLoading}
          alt={metadata?.name || title}
          aspectRatio="418 / 332"
        />

        {indexedQuery.isError && (
          <S.EmptyText role="alert">
            Indexed NFT details could not be loaded.{" "}
            <S.RetryButton type="button" disabled={indexedQuery.isFetching} onClick={() => indexedQuery.refetch()}>
              Retry
            </S.RetryButton>
          </S.EmptyText>
        )}

        <S.Rows>
          <S.Row>
            <dt>Owner</dt>
            <dd>
              {item?.ownerAddress ? (
                <DatatableItem.AddressCopy
                  address={item.ownerAddress}
                  label={item.ownerLabel}
                  labelType={item.ownerLabelType}
                />
              ) : (
                EMPTY_VALUE
              )}
            </dd>
          </S.Row>
          {staked && (
            <S.Row>
              <dt title="Address that staked this position; the staker realm holds the NFT meanwhile">Operator</dt>
              <dd>
                {item.operatorAddress ? <DatatableItem.AddressCopy address={item.operatorAddress} /> : EMPTY_VALUE}
              </dd>
            </S.Row>
          )}
          <S.Row>
            <dt title="Caller of the latest mint, including remints; not necessarily the recipient">Minted By</dt>
            <dd>
              {indexedDetail?.mintedBy ? <DatatableItem.AddressCopy address={indexedDetail.mintedBy} /> : EMPTY_VALUE}
            </dd>
          </S.Row>
          <S.Row>
            <dt title="Latest transfer, excluding mint and burn events">Last Transfer</dt>
            <dd className="last-transfer-value">
              {indexedDetail?.lastTransferBlockTime ? (
                <span>
                  <time dateTime={indexedDetail.lastTransferBlockTime} title={indexedDetail.lastTransferBlockTime}>
                    {formatNftRelativeTime(indexedDetail.lastTransferBlockTime)}
                  </time>
                  {lastTransfer && (
                    <>
                      {" · Block "}
                      <Link href={getUrlWithNetwork(`/block/${lastTransfer.blockHeight}`)}>
                        {makeDisplayNumber(lastTransfer.blockHeight)}
                      </Link>
                    </>
                  )}
                </span>
              ) : (
                EMPTY_VALUE
              )}
            </dd>
          </S.Row>
          <S.Row>
            <dt>Royalty</dt>
            <dd>
              {indexedDetail?.royaltyStatus === "found" && indexedDetail.royalty ? (
                <S.RoyaltyValue title="Indexed royalty policy; not a settlement guarantee">
                  <span>
                    {indexedDetail.royalty.bps / 100}% <b>→</b>
                  </span>
                  <Link
                    href={getUrlWithNetwork(`/account/${indexedDetail.royalty.receiver}`)}
                    title={indexedDetail.royalty.receiver}
                  >
                    {textEllipsis(indexedDetail.royalty.receiver, 8)}
                  </Link>
                </S.RoyaltyValue>
              ) : (
                EMPTY_VALUE
              )}
            </dd>
          </S.Row>
        </S.Rows>

        {isGnftPackagePath(tokenKey) ? (
          <NftPositionInfo
            nftId={nftId}
            position={indexedQuery.isLoading ? undefined : indexedDetail?.position ?? null}
            holderAddress={staked ? item?.operatorAddress : item?.ownerAddress}
          />
        ) : (
          <S.Section $variant="attributes">
            <S.SectionTitle $attributes>
              {isLoading ? "Attributes" : `Attributes · ${attributes.length}`}
            </S.SectionTitle>
            {!isLoading && attributes.length > 0 && (
              <S.Attributes>
                {attributes.map((attribute, index) => (
                  <S.Attribute key={`${attribute.traitType}:${index}`}>
                    <dt>{attribute.traitType}</dt>
                    <dd>{attribute.value || EMPTY_VALUE}</dd>
                  </S.Attribute>
                ))}
              </S.Attributes>
            )}
          </S.Section>
        )}

        <S.Section $variant="history">
          <S.SectionTitle>Transfer History</S.SectionTitle>
          {!transfersQuery.isLoading && (
            <>
              {transfers.length > 0 ? (
                <S.TransferList>
                  {transfers.map((transfer, index) => {
                    const isTransfer = !!transfer.fromAddress && !!transfer.toAddress;
                    const eventName = !transfer.fromAddress ? "Mint" : "Burn";
                    const addresses = isTransfer
                      ? [transfer.fromAddress, transfer.toAddress]
                      : [transfer.callerAddress];
                    const txHash = isBase64Hash(transfer.transactionHash)
                      ? base64HashToHex(transfer.transactionHash)
                      : transfer.transactionHash;

                    return (
                      <S.TransferItem key={index}>
                        <S.TransferDescription>
                          {addresses.map((address, addressIndex) => {
                            const owner = item?.ownerAddress === address ? item : null;
                            const label = owner?.ownerLabel;
                            return (
                              <React.Fragment key={addressIndex}>
                                <span className="event-prefix">
                                  {isTransfer ? (
                                    addressIndex === 0 ? (
                                      <>
                                        <b>Transfer</b> from
                                      </>
                                    ) : (
                                      "to"
                                    )
                                  ) : (
                                    <>
                                      <b>{eventName}</b> by
                                    </>
                                  )}
                                </span>
                                {address ? (
                                  <S.TransferParty>
                                    <Tooltip content={address}>
                                      <Link
                                        href={getUrlWithNetwork(
                                          getAddressLinkPath({ address, label, labelType: owner?.ownerLabelType }),
                                        )}
                                      >
                                        {label ? stripGnoLandPrefix(label) : textEllipsis(address, 6)}
                                      </Link>
                                    </Tooltip>
                                    <CopyTooltip copyText={address} variant="plain" iconClassName="copy-icon" />
                                  </S.TransferParty>
                                ) : (
                                  EMPTY_VALUE
                                )}
                              </React.Fragment>
                            );
                          })}
                        </S.TransferDescription>
                        <S.TransferMeta>
                          <time dateTime={transfer.blockTime || undefined} title={transfer.blockTime || undefined}>
                            {formatNftRelativeTime(transfer.blockTime)}
                          </time>
                          <span>·</span>
                          {txHash ? (
                            <Link
                              href={getUrlWithNetwork(`/transactions/details?txhash=${txHash}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={txHash}
                            >
                              Txhash <IconLink viewBox="0 0 16 16" />
                            </Link>
                          ) : (
                            EMPTY_VALUE
                          )}
                        </S.TransferMeta>
                      </S.TransferItem>
                    );
                  })}
                </S.TransferList>
              ) : (
                !transfersQuery.isError && <S.EmptyText>{EMPTY_VALUE}</S.EmptyText>
              )}
              {transfersQuery.isError && (
                <S.EmptyText role="alert">
                  Transfer history could not be loaded.{" "}
                  <S.RetryButton
                    type="button"
                    disabled={transfersQuery.isFetching}
                    onClick={() => transfersQuery.refetch()}
                  >
                    Retry
                  </S.RetryButton>
                </S.EmptyText>
              )}
            </>
          )}
          <Pagination
            page={transferPage}
            totalPages={totalTransferPages}
            hasNext={transfersQuery.data?.page.hasNext}
            hideFirstPageButtonWhenDisabled
            hideLastPageButtonWhenCurrent
            onChangePage={changeTransferPage}
          />
        </S.Section>

        <S.Section $variant="technical">
          <S.SectionTitle>Technical</S.SectionTitle>
          <S.Rows>
            <S.Row compact>
              <dt title="Package that emitted the collection creation event; not a certification of standards compliance">
                Standard
              </dt>
              <dd title="Creation-event emitter, not standards certification">{standardPackage || EMPTY_VALUE}</dd>
            </S.Row>
            <S.Row compact>
              <dt>Token URL</dt>
              <dd>
                {tokenUrl ? (
                  tokenLink && /^https?:/i.test(tokenLink) ? (
                    <a href={tokenLink} target="_blank" rel="noopener noreferrer" title={tokenUrl}>
                      {tokenUrl}
                    </a>
                  ) : (
                    <Tooltip content="Copied!" trigger="click" copyText={tokenUrl}>
                      <S.TokenUriButton type="button" title={tokenUrl}>
                        {tokenUrl}
                      </S.TokenUriButton>
                    </Tooltip>
                  )
                ) : (
                  EMPTY_VALUE
                )}
              </dd>
            </S.Row>
            <S.Row compact>
              <dt title="Latest mint, including remints">Mint height</dt>
              <dd>
                {indexedDetail?.lastMintBlockHeight != null ? (
                  <span>
                    Block{" "}
                    <Link href={getUrlWithNetwork(`/block/${indexedDetail.lastMintBlockHeight}`)}>
                      {makeDisplayNumber(indexedDetail.lastMintBlockHeight)}
                    </Link>
                  </span>
                ) : (
                  EMPTY_VALUE
                )}
              </dd>
            </S.Row>
            <S.Row compact>
              <dt title="Latest mint, including remints">Mint Transaction</dt>
              <dd>
                {displayMintHash ? (
                  <Link
                    href={getUrlWithNetwork(`/transactions/details?txhash=${displayMintHash}`)}
                    title={displayMintHash}
                  >
                    {displayMintHash.slice(0, 7)}…{displayMintHash.slice(-6)}
                  </Link>
                ) : (
                  EMPTY_VALUE
                )}
              </dd>
            </S.Row>
            <S.Row compact>
              <dt title="Latest mint, including remints">Minted at</dt>
              <dd>
                {indexedDetail?.lastMintBlockTime ? (
                  <time dateTime={indexedDetail.lastMintBlockTime} title={indexedDetail.lastMintBlockTime}>
                    {formatNftRelativeTime(indexedDetail.lastMintBlockTime)}
                    {" · "}
                    {dayjs(indexedDetail.lastMintBlockTime).format("YYYY-MM-DD HH:mm")}
                  </time>
                ) : (
                  EMPTY_VALUE
                )}
              </dd>
            </S.Row>
          </S.Rows>
        </S.Section>

        <S.Footer>
          <Tooltip
            content="Copied!"
            trigger="click"
            copyText={typeof window === "undefined" ? "" : window.location.href}
          >
            <S.CopyUrlButton type="button">Copy URL</S.CopyUrlButton>
          </Tooltip>
        </S.Footer>
      </S.Panel>
    </>
  );
};

export default NftTokenPanel;
