import React from "react";
import styled from "styled-components";

import { fitPathToWidth, formatDisplayPackagePath } from "@/common/utils/string-util";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface PathTextProps {
  path: string | null | undefined;
  className?: string;
  align?: "left" | "right";
  // Shown right after the visible path, SUFFIX_GAP away from its end (e.g. an external-link icon).
  suffix?: React.ReactNode;
}

const SUFFIX_GAP = 4;

// A package path shortened by formatDisplayPackagePath (first and last 4 characters of each address). When it
// still does not fit its area, whole leading segments are replaced by ".../" so the trailing names stay visible
// and no address is cut in the middle; the last two segments are cut from the front only as a last resort.
const PathText = ({ path, className, align = "left", suffix }: PathTextProps) => {
  const text = formatDisplayPackagePath(path);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const sizerRef = React.useRef<HTMLSpanElement>(null);
  const suffixRef = React.useRef<HTMLSpanElement>(null);
  const hasSuffix = !!suffix;
  const [display, setDisplay] = React.useState(text);

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    const sizer = sizerRef.current;
    if (!wrapper || !measure || !sizer) return;

    // The suffix sits after the path, so the path area is what is left of the wrapper beside it. The sizer
    // reserves the same room, which lets the path grow back to full length when the suffix fits as well.
    const reserved = suffixRef.current ? suffixRef.current.offsetWidth + SUFFIX_GAP : 0;
    sizer.style.paddingRight = reserved ? `${reserved}px` : "";

    const fit = () => {
      setDisplay(
        fitPathToWidth(text, wrapper.clientWidth - reserved, candidate => {
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
  }, [text, hasSuffix]);

  return (
    <Wrapper ref={wrapperRef} className={className} $align={align}>
      {/* Keeps the area as wide as the full path wants, so it can grow back after being shortened. */}
      <Sizer ref={sizerRef} aria-hidden="true">
        {text}
      </Sizer>
      <Visible $align={align} $withSuffix={hasSuffix}>
        {hasSuffix ? (
          <>
            <VisibleText>{display}</VisibleText>
            <SuffixSlot ref={suffixRef}>{suffix}</SuffixSlot>
          </>
        ) : (
          display
        )}
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

// fitPathToWidth already cuts the front behind its own "...", so the text never overflows; nothing is clipped by
// CSS, which keeps every row's text starting at the same left edge.
const Visible = styled.span<{ $align: "left" | "right"; $withSuffix: boolean }>`
  display: ${({ $withSuffix }) => ($withSuffix ? "flex" : "block")};
  align-items: center;
  justify-content: ${({ $align }) => ($align === "right" ? "flex-end" : "flex-start")};
  gap: ${SUFFIX_GAP}px;
  overflow: hidden;
`;

const VisibleText = styled.span`
  min-width: 0;
  white-space: nowrap;
`;

const SuffixSlot = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
`;

const Measure = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
`;
