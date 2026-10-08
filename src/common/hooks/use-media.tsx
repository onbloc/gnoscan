/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const isDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  const desktop = useMediaQuery({ minWidth: 1280 });

  useEffect(() => setIsDesktop(desktop), [desktop]);
  return isDesktop;
};

export const eachMedia = (): string => {
  const [media, setMedia] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  useEffect(() => {
    if (isDesktop) {
      return setMedia("desktop");
    } else if (isTablet) {
      return setMedia("tablet");
    } else if (isMobile) {
      return setMedia("mobile");
    }
  }, [isMobile, isTablet, isDesktop]);

  return media;
};
