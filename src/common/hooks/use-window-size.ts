import React from "react";
import { useMediaQuery } from "react-responsive";
import { DEVICE_TYPE } from "../values/ui.constant";

/**
 * Custom hooks to detect device type based on current screen size
 */
export const useWindowSize = () => {
  const [breakpoint, setBreakpoint] = React.useState<DEVICE_TYPE>(DEVICE_TYPE.DESKTOP);

  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  React.useEffect(() => {
    if (isDesktop) {
      setBreakpoint(DEVICE_TYPE.DESKTOP);
    } else if (isTablet) {
      setBreakpoint(DEVICE_TYPE.TABLET);
    } else if (isMobile) {
      setBreakpoint(DEVICE_TYPE.MOBILE);
    }
  }, [isDesktop, isTablet, isMobile]);

  return {
    breakpoint,
    isDesktop,
    isTablet,
    isMobile,
  };
};
