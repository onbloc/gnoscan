import React from "react";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { getAssetGridColumn, getAssetGridRowSpan } from "./account-assets.utility";
import * as S from "./AccountAssets.styles";

// useLayoutEffect warns during SSR; it only matters on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface AccountAssetGridProps {
  breakpoint: DEVICE_TYPE;
  children: React.ReactNode;
}

const AccountAssetGrid = ({ breakpoint, children }: AccountAssetGridProps) => {
  const items = React.Children.toArray(children);

  if (breakpoint !== DEVICE_TYPE.DESKTOP) {
    return <S.GridLayout breakpoint={breakpoint}>{items}</S.GridLayout>;
  }

  return (
    <S.MasonryGrid>
      {items.map((item, index) => (
        <AssetGridCell key={React.isValidElement(item) ? item.key : index} column={getAssetGridColumn(index)}>
          {item}
        </AssetGridCell>
      ))}
    </S.MasonryGrid>
  );
};

const AssetGridCell = ({ column, children }: { column: number; children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = React.useState<number>();

  useIsomorphicLayoutEffect(() => {
    const cell = ref.current;
    if (!cell || typeof ResizeObserver === "undefined") return;

    const update = () => setRowSpan(getAssetGridRowSpan(cell.getBoundingClientRect().height));
    update();

    // Tracks the vesting card while it expands or collapses
    const observer = new ResizeObserver(update);
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);

  return (
    <S.GridCell ref={ref} style={{ gridColumn: column, gridRowEnd: rowSpan ? `span ${rowSpan}` : undefined }}>
      {children}
    </S.GridCell>
  );
};

export default AccountAssetGrid;
