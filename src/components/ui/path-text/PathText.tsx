import React from "react";
import styled from "styled-components";

import { fitPathToWidth, formatDisplayPackagePath } from "@/common/utils/string-util";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface PathTextProps {
  path: string | null | undefined;
  className?: string;
  align?: "left" | "right";
}

// A package path shortened by formatDisplayPackagePath (first and last 4 characters of each address). When it
// still does not fit its area, whole leading segments are replaced by ".../" so the trailing names stay fully
// visible and no address is cut in the middle.
const PathText = ({ path, className, align = "left" }: PathTextProps) => {
  const text = formatDisplayPackagePath(path);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(text);

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (!wrapper || !measure) return;

    const fit = () => {
      setDisplay(
        fitPathToWidth(text, wrapper.clientWidth, candidate => {
          measure.textContent = candidate;
          return measure.offsetWidth;
        }),
      );
    };
    fit();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [text]);

  return (
    <Wrapper ref={wrapperRef} className={className} $align={align}>
      {/* Keeps the area as wide as the full path wants, so it can grow back after being shortened. */}
      <Sizer aria-hidden="true">{text}</Sizer>
      <Visible>
        <bdi>{display}</bdi>
      </Visible>
      <Measure ref={measureRef} aria-hidden="true" />
    </Wrapper>
  );
};

export default PathText;

const Wrapper = styled.span<{ $align: "left" | "right" }>`
  position: relative;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-align: ${({ $align }) => $align};
`;

const Sizer = styled.span`
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
`;

// Only the last segment can still overflow; it is cut from the start so its end stays visible.
const Visible = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;

  bdi {
    direction: ltr;
  }
`;

const Measure = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
`;
