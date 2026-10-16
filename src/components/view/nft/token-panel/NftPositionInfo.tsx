import React from "react";

import {
  gnoswapPoolUrl,
  gnoswapPositionUrl,
  formatPoolFeePercent,
  parsePoolPath,
} from "@/common/utils/gnoswap-link.utility";
import { NftPositionModel } from "@/repositories/api/token/response";
import { getTokenSymbol, useTokenInfosByKeys } from "../../transaction/transaction-message-summary/transfer-render";
import * as S from "./NftTokenPanel.styles";

const EMPTY_VALUE = "-";

// Figma 6565:14919 cell widths in px, as shares of the row (the cells fill it).
const CELL_WIDTH = { pool: 144.769, feeTier: 87.8, range: 170.359 };
const CELL_TOTAL = CELL_WIDTH.pool + CELL_WIDTH.feeTier + CELL_WIDTH.range;
const CELL_RATIO = {
  pool: CELL_WIDTH.pool / CELL_TOTAL,
  feeTier: CELL_WIDTH.feeTier / CELL_TOTAL,
  range: CELL_WIDTH.range / CELL_TOTAL,
};

interface NftPositionInfoProps {
  nftId: string;
  // null when the NFT has no indexed position; undefined while the detail is still loading
  position: NftPositionModel | null | undefined;
  // Whoever holds the position in gnoswap: the owner, or the operator who staked it
  holderAddress?: string;
}

// The GNFT counterpart of Attributes: the position's pool, fee tier and range as boxes. The pool opens its
// gnoswap page and the range opens this position on it, like the pool and position links in transaction summaries.
const NftPositionInfo = ({ nftId, position, holderAddress }: NftPositionInfoProps) => {
  const parsedPool = React.useMemo(() => (position ? parsePoolPath(position.poolPath) : null), [position]);
  const tokenKeys = React.useMemo(
    () => (parsedPool ? [parsedPool.token0Path, parsedPool.token1Path] : []),
    [parsedPool],
  );
  const tokenInfos = useTokenInfosByKeys(tokenKeys);
  // Symbols in capitals, as the Figma pool box shows them ("GNS / WUGNOT")
  const pairLabel = parsedPool
    ? `${getTokenSymbol(parsedPool.token0Path, tokenInfos)} / ${getTokenSymbol(
        parsedPool.token1Path,
        tokenInfos,
      )}`.toUpperCase()
    : "";

  return (
    <S.Section $variant="attributes">
      <S.SectionTitle $attributes>Pool &amp; Position Information</S.SectionTitle>
      {position === null && <S.EmptyText>{EMPTY_VALUE}</S.EmptyText>}
      {position && parsedPool && (
        <S.PositionBoxes>
          <S.PositionBox $ratio={CELL_RATIO.pool}>
            <dt>Pool</dt>
            <dd>
              <S.AttributeLink
                href={gnoswapPoolUrl(position.poolPath)}
                target="_blank"
                rel="noopener noreferrer"
                title="Open the pool on GnoSwap"
              >
                {pairLabel}
              </S.AttributeLink>
            </dd>
          </S.PositionBox>
          <S.PositionBox $ratio={CELL_RATIO.feeTier}>
            <dt>Fee Tier</dt>
            <dd>{formatPoolFeePercent(position.feeTier)}</dd>
          </S.PositionBox>
          <S.PositionBox $ratio={CELL_RATIO.range}>
            <dt>Range</dt>
            <dd>
              <S.AttributeLink
                href={gnoswapPositionUrl(position.poolPath, nftId, holderAddress)}
                target="_blank"
                rel="noopener noreferrer"
                title="Open this position on GnoSwap"
              >
                {position.tickLower} ~ {position.tickUpper}
              </S.AttributeLink>
            </dd>
          </S.PositionBox>
        </S.PositionBoxes>
      )}
    </S.Section>
  );
};

export default NftPositionInfo;
