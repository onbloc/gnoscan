import React from "react";

import { DEVICE_SIZE_THRESHOLDS } from "@/common/values/ui.constant";

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.6;

/**
 * Lets a bottom sheet be dragged down to close it. A drag only takes over when the sheet's own
 * content is scrolled to the top, so scrolling the content up and down keeps working.
 * Below desktop only; the sheet's CSS transition animates the snap back and the dismissal.
 */
export function useSheetDragDismiss(ref: React.RefObject<HTMLElement | null>, enabled: boolean, onClose: () => void) {
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    const sheet = ref.current;
    if (!enabled || !sheet) return;
    const isSheetLayout = () => window.matchMedia(`(max-width: ${DEVICE_SIZE_THRESHOLDS.DESKTOP - 1}px)`).matches;

    let startY = 0;
    let startTime = 0;
    let offset = 0;
    let tracking = false;
    let dragging = false;

    const reset = () => {
      sheet.style.transition = "";
      sheet.style.transform = "";
    };

    const onTouchStart = (event: TouchEvent) => {
      tracking = event.touches.length === 1 && isSheetLayout();
      dragging = false;
      offset = 0;
      if (!tracking) return;
      startY = event.touches[0].clientY;
      startTime = event.timeStamp;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!tracking) return;
      const delta = event.touches[0].clientY - startY;
      if (!dragging) {
        // Dragging down from the top of the content starts the dismiss gesture; anything else scrolls.
        if (delta <= 0 || sheet.scrollTop > 0) return;
        dragging = true;
        sheet.style.transition = "none";
      }
      offset = Math.max(delta, 0);
      sheet.style.transform = `translateY(${offset}px)`;
      event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (!dragging) return;
      dragging = false;
      const velocity = offset / Math.max(event.timeStamp - startTime, 1);
      sheet.style.transition = "";
      if (offset > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
        // Leaves the drag offset in place; closing animates it away, and the cleanup below clears it.
        onCloseRef.current();
      } else {
        sheet.style.transform = "";
      }
    };

    sheet.addEventListener("touchstart", onTouchStart, { passive: true });
    sheet.addEventListener("touchmove", onTouchMove, { passive: false });
    sheet.addEventListener("touchend", onTouchEnd);
    sheet.addEventListener("touchcancel", onTouchEnd);
    return () => {
      sheet.removeEventListener("touchstart", onTouchStart);
      sheet.removeEventListener("touchmove", onTouchMove);
      sheet.removeEventListener("touchend", onTouchEnd);
      sheet.removeEventListener("touchcancel", onTouchEnd);
      reset();
    };
  }, [ref, enabled]);
}
