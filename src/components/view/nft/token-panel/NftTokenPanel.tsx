import React from "react";

import { useGetNftTokenDetail } from "@/common/react-query/token/api";
import { nftArtwork, nftMediaUrl } from "@/common/utils/nft-media.utility";
import { NftCollectionItemModel } from "@/repositories/api/token/response";

import IconArrow from "@/assets/svgs/icon-arrow.svg";
import IconClose from "@/assets/svgs/icon-close.svg";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import Tooltip from "@/components/ui/tooltip";
import { DatatableItem } from "../../datatable";
import NftImage from "../nft-image/NftImage";
import * as S from "./NftTokenPanel.styles";

// The indexed API does not yet expose mint, transfer history or royalty per NFT.
const EMPTY_VALUE = "-";
// The only GRC721 standard package on gno.land
const GRC721_STANDARD = "gno.land/p/nt/grc721/v0";

const PANEL_TRANSITION_MS = 400;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface NftTokenPanelProps {
  nftId: string;
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
  const { data: detail, isLoading, isError, refetch } = useGetNftTokenDetail(packagePath, nftId);
  const metadata = detail?.metadataStatus === "found" ? detail.metadata : null;
  const attributes = metadata?.attributes ?? [];
  const tokenUrl = detail?.status === "found" ? detail.uri : "";
  const tokenLink = nftMediaUrl(tokenUrl);
  const needsRefresh = isError || detail?.uriNeedsRefetch || detail?.metadataNeedsRefetch;
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
          </S.TitleArea>
          <S.HeaderButtons>
            <Tooltip
              content="Copied!"
              trigger="click"
              copyText={typeof window === "undefined" ? "" : window.location.href}
            >
              <S.IconButton as="span" role="button" aria-label="Copy token URL">
                <IconCopy className="icon-stroke" />
              </S.IconButton>
            </Tooltip>
            <S.IconButton type="button" aria-label="Close token details" onClick={onClose}>
              <IconClose className="icon-stroke icon-close" />
            </S.IconButton>
          </S.HeaderButtons>
        </S.Header>

        <NftImage src={nftArtwork(metadata, tokenUrl)} alt={metadata?.name || title} aspectRatio="418 / 332" />

        {needsRefresh && (
          <S.EmptyText role="status">
            NFT metadata could not be fully loaded.{" "}
            <S.RetryButton type="button" onClick={() => refetch()}>
              Retry
            </S.RetryButton>
          </S.EmptyText>
        )}

        <S.Rows>
          <S.Row>
            <dt>Owner</dt>
            <dd>
              {item ? (
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
          <S.Row>
            <dt>Minted By</dt>
            <dd>{EMPTY_VALUE}</dd>
          </S.Row>
          <S.Row>
            <dt>Last Transfer</dt>
            <dd>{EMPTY_VALUE}</dd>
          </S.Row>
          <S.Row>
            <dt>Royalty</dt>
            <dd>{EMPTY_VALUE}</dd>
          </S.Row>
        </S.Rows>

        <S.Section>
          <S.SectionTitle>Attributes{attributes.length > 0 ? ` · ${attributes.length}` : ""}</S.SectionTitle>
          {attributes.length > 0 ? (
            <S.Attributes>
              {attributes.map((attribute, index) => (
                <S.Attribute key={`${attribute.traitType}:${index}`}>
                  <dt>{attribute.traitType}</dt>
                  <dd>{attribute.value}</dd>
                </S.Attribute>
              ))}
            </S.Attributes>
          ) : (
            <S.EmptyText>{isLoading ? "Loading…" : EMPTY_VALUE}</S.EmptyText>
          )}
        </S.Section>

        <S.Section>
          <S.SectionTitle>Transfer History</S.SectionTitle>
          <S.EmptyText>{EMPTY_VALUE}</S.EmptyText>
        </S.Section>

        <S.Section>
          <S.SectionTitle>Technical</S.SectionTitle>
          <S.Rows>
            <S.Row compact>
              <dt>Standard</dt>
              <dd>{GRC721_STANDARD}</dd>
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
                      <S.RetryButton type="button">Copy token URI</S.RetryButton>
                    </Tooltip>
                  )
                ) : isLoading ? (
                  "Loading…"
                ) : (
                  EMPTY_VALUE
                )}
              </dd>
            </S.Row>
            <S.Row compact>
              <dt>Mint height</dt>
              <dd>{EMPTY_VALUE}</dd>
            </S.Row>
            <S.Row compact>
              <dt>Mint Transaction</dt>
              <dd>{EMPTY_VALUE}</dd>
            </S.Row>
            <S.Row compact>
              <dt>Minted at</dt>
              <dd>{EMPTY_VALUE}</dd>
            </S.Row>
          </S.Rows>
        </S.Section>

        <Tooltip content="Copied!" trigger="click" copyText={typeof window === "undefined" ? "" : window.location.href}>
          <S.CopyUrlButton type="button">Copy URL</S.CopyUrlButton>
        </Tooltip>
      </S.Panel>
    </>
  );
};

export default NftTokenPanel;
