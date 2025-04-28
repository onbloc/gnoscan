"use client";

import React from "react";

import { useRouter } from "@/common/hooks/common/use-router";
import { useThemeMode } from "@/common/hooks/use-theme-mode";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./NotFound.styles";
import BackgroundSearchNotFound from "@/assets/svgs/bg-search-not-found.svg";
import BackgroundSearchNotFoundLight from "@/assets/svgs/bg-search-not-found-light.svg";
import { Button } from "@/components/ui/button";

interface Props {
  keyword?: string;
  breakpoint?: DEVICE_TYPE;
}

const NotFound = ({ keyword, breakpoint }: Props) => {
  const { isDark } = useThemeMode();
  const { replace } = useRouter();

  const replaceHome = () => {
    replace("/" + location.search);
  };

  return (
    <S.Wrapper className={breakpoint}>
      <div className="info-area">
        <p className="title">{"Search not found"}</p>
        <div className="description">
          <span>{"There are no results found for"}</span>
          <span>
            <b>{`"${keyword}"`}</b>
          </span>
          <span>{"Please make sure your input is valid and try again. "}</span>
        </div>
        <Button className="home-button" onClick={replaceHome}>
          {"Back to Home"}
        </Button>
      </div>
      {breakpoint === DEVICE_TYPE.DESKTOP && (
        <div className="asset-area">{isDark ? <BackgroundSearchNotFound /> : <BackgroundSearchNotFoundLight />}</div>
      )}
    </S.Wrapper>
  );
};

export default NotFound;
