/* eslint-disable react-hooks/refs */
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from "@floating-ui/react";
import React from "react";

import { zindex } from "@/common/values/z-index";

import { BaseTooltipWrapper, Content, TooltipLayer } from "./FloatingTooltip.styles";

interface FloatingTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
  width?: React.CSSProperties["width"];
  className?: string;
  floatClassName?: string;
  enabled?: boolean;
  ariaLabel?: string;
}

const FloatingTooltip = ({
  children,
  content,
  placement = "top",
  width,
  className,
  floatClassName,
  enabled = true,
  ariaLabel = "Show tooltip",
}: FloatingTooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const [arrowElement, setArrowElement] = React.useState<SVGSVGElement | null>(null);
  const middleware = React.useMemo(
    () => [
      offset(20),
      flip({
        fallbackAxisSideDirection: "start" as const,
      }),
      shift({
        mainAxis: true,
        crossAxis: true,
      }),
      ...(arrowElement
        ? [
            arrow({
              element: arrowElement,
            }),
          ]
        : []),
    ],
    [arrowElement],
  );

  const { x, y, refs, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const hover = useHover(context, {
    enabled,
    handleClose: safePolygon({ buffer: -Infinity }),
  });
  const focus = useFocus(context, { enabled });
  const click = useClick(context, { enabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role]);
  const referenceRef = useMergeRefs([refs.setReference]);

  const showTooltip = enabled && open;

  return (
    <>
      <BaseTooltipWrapper
        ref={referenceRef}
        type="button"
        aria-label={ariaLabel}
        aria-disabled={!enabled}
        style={{
          width,
        }}
        className={className}
        {...getReferenceProps()}
      >
        {children}
      </BaseTooltipWrapper>
      <FloatingPortal>
        {showTooltip && (
          <TooltipLayer
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              visibility: x == null ? "hidden" : "visible",
              zIndex: zindex.modal + 1,
            }}
            className={floatClassName}
            {...getFloatingProps()}
          >
            <FloatingArrow
              ref={setArrowElement}
              context={context}
              fill="currentColor"
              width={20}
              height={14}
              tipRadius={4}
            />
            <Content>{content}</Content>
          </TooltipLayer>
        )}
      </FloatingPortal>
    </>
  );
};

export default FloatingTooltip;
