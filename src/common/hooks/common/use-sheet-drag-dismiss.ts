import React from "react";

import { DEVICE_SIZE_THRESHOLDS } from "@/common/values/ui.constant";

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.6;
const SETTLE_FALLBACK_MS = 600;

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

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let startedAtTop = false;
    let offset = 0;
    let tracking = false;
    let dragging = false;
    let settleTimer: number | undefined;

    const reset = () => {
      sheet.style.transition = "";
      sheet.style.transform = "";
    };

    const onTouchStart = (event: TouchEvent) => {
      tracking = event.touches.length === 1 && isSheetLayout();
      dragging = false;
      offset = 0;
      if (!tracking) return;
      startedAtTop = sheet.scrollTop <= 0;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startTime = event.timeStamp;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!tracking) return;
      const { clientX, clientY } = event.touches[0];
      const delta = clientY - startY;
      if (!dragging) {
        // A horizontal gesture is not a dismiss; leave it alone for the rest of the touch.
        if (Math.abs(clientX - startX) > Math.abs(delta)) {
          tracking = false;
          return;
        }
        // Only a gesture that began at the top of the content can dismiss. One that began as scrolling stays
        // scrolling until the next touch, so scrolling back to the top never closes the sheet.
        if (!startedAtTop || delta <= 0 || sheet.scrollTop > 0) return;
        dragging = true;
        startY = clientY;
        startTime = event.timeStamp;
        sheet.style.transition = "none";
        event.preventDefault();
        return;
      }
      offset = Math.max(clientY - startY, 0);
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
        // Leaves the drag offset in place so closing animates from it, and the cleanup below clears it.
        // If the caller keeps the sheet open, snap back instead of leaving it stuck mid-screen.
        onCloseRef.current();
        settleTimer = window.setTimeout(reset, SETTLE_FALLBACK_MS);
      } else {
        sheet.style.transform = "";
      }
    };

    const onTouchCancel = () => {
      tracking = false;
      dragging = false;
      reset();
    };

    sheet.addEventListener("touchstart", onTouchStart, { passive: true });
    sheet.addEventListener("touchmove", onTouchMove, { passive: false });
    sheet.addEventListener("touchend", onTouchEnd);
    sheet.addEventListener("touchcancel", onTouchCancel);
    return () => {
      sheet.removeEventListener("touchstart", onTouchStart);
      sheet.removeEventListener("touchmove", onTouchMove);
      sheet.removeEventListener("touchend", onTouchEnd);
      sheet.removeEventListener("touchcancel", onTouchCancel);
      window.clearTimeout(settleTimer);
      reset();
    };
  }, [ref, enabled]);
}
