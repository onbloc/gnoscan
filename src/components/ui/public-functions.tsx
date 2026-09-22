import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ViewMoreButton } from "@/components/ui/button";

const PublicFunctions = ({ children }: { children: React.ReactNode }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number>();

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      let row = 0;
      let previousTop = -1;
      let height = 0;
      let overflowing = false;
      for (const child of Array.from(list.children)) {
        const badge = child as HTMLElement;
        if (badge.offsetTop !== previousTop) {
          row += 1;
          previousTop = badge.offsetTop;
        }
        if (row > 2) {
          overflowing = true;
          break;
        }
        height = Math.max(height, badge.offsetTop + badge.offsetHeight);
      }
      setCollapsedHeight(overflowing ? height : undefined);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [children]);

  return (
    <Wrapper>
      <div style={{ maxHeight: expanded ? undefined : collapsedHeight, overflow: "hidden" }}>
        <List ref={listRef}>{children}</List>
      </div>
      {collapsedHeight !== undefined && (
        <ViewMoreButton text={expanded ? "Hide" : "Show More"} onClick={() => setExpanded(value => !value)} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.dd`
  min-width: 0;
`;

const List = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px 15px;

  > .badge {
    margin: 0;
    width: auto;
    max-width: 100%;
    overflow-wrap: anywhere;
  }
`;

export default PublicFunctions;
