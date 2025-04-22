import { Spinner } from "@/components/ui/loading";
import { themeState } from "@/states";
import React, { useEffect, useRef, useState } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

export const MainNewsTwitter = () => {
  const GNOSCAN_LIST_ID = "1597532886152151042";
  const themeMode = useRecoilValue(themeState);

  const isLight = () => {
    return themeMode !== "dark";
  };

  return (
    <Wrapper>
      {themeMode !== "" ? (
        <TwitterTimelineEmbed
          key={isLight() ? "twitter-l" : "twitter-d"}
          id={GNOSCAN_LIST_ID}
          sourceType={"list"}
          noHeader
          noScrollbar
          autoHeight
          theme={isLight() ? "light" : "dark"}
        />
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: calc(100% - 40px);

  & .twitter-wrapper {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
`;
