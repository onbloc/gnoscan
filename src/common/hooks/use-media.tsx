import React, {useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';

interface Props {
  children: React.ReactNode;
}

export const Mobile = ({children}: Props) => {
  const isMobile = useMediaQuery({maxWidth: 767});
  return <>{isMobile && children}</>;
};

export const Tablet = ({children}: Props) => {
  const isTablet = useMediaQuery({minWidth: 768, maxWidth: 1279});
  return <>{isTablet && children}</>;
};

export const Desktop = ({children}: Props) => {
  const isDesktop = useMediaQuery({minWidth: 1280});
  return <>{isDesktop && children}</>;
};

export const NotDesktop = ({children}: Props) => {
  const isDesktop = useMediaQuery({minWidth: 1280});
  return <>{!isDesktop && children}</>;
};

export const isDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({minWidth: 1280});

  useEffect(() => setIsDesktop(desktop), [desktop]);
  return isDesktop;
};

export const eachMedia = (): string => {
  const [media, setMedia] = useState('');
  const isMobile = useMediaQuery({maxWidth: 767});
  const isTablet = useMediaQuery({minWidth: 768, maxWidth: 1279});
  const isDesktop = useMediaQuery({minWidth: 1280});

  useEffect(() => {
    if (isDesktop) {
      return setMedia('desktop');
    } else if (isTablet) {
      return setMedia('tablet');
    } else if (isMobile) {
      return setMedia('mobile');
    }
  }, [isMobile, isTablet, isDesktop]);

  return media;
};
