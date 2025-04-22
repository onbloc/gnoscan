"use client";

import React from "react";
import styled from "styled-components";
import { eachMedia } from "@/common/hooks/use-media";
import BackgroundSearchNotFound from "@/assets/svgs/bg-search-not-found.svg";
import BackgroundSearchNotFoundLight from "@/assets/svgs/bg-search-not-found-light.svg";
import { Button } from "@/components/ui/button";
import theme from "@/styles/theme";
import { useThemeMode } from "@/common/hooks/use-theme-mode";
import { useRouter } from "@/common/hooks/common/use-router";

interface Props {
  keyword?: string;
}

const NotFound = ({ keyword }: Props) => {
  const { isDark } = useThemeMode();
  const media = eachMedia();
  const { replace } = useRouter();

  const replaceHome = () => {
    replace("/" + location.search);
  };

  return (
    <Wrapper className={media}>
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
      {media === "desktop" && (
        <div className="asset-area">{isDark ? <BackgroundSearchNotFound /> : <BackgroundSearchNotFoundLight />}</div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 136px - 200px);
    min-height: 500px;
    overflow: hidden;

    .info-area {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: ${({ theme }) => theme.colors.reverse};

      .title {
        ${theme.fonts.h3};
        margin-bottom: 20px;
      }

      .description {
        display: flex;
        flex-direction: column;
        margin-bottom: 44px;

        span {
          ${theme.fonts.p4};
          margin: 4px 0;
        }

        b {
          font-weight: 600;
        }
      }

      .home-button {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.blue};
        padding: 10px 24px;
        border-radius: 4px;
        ${theme.fonts.p3};
      }
    }

    .asset-area {
      display: none;
    }
  }

  &.desktop {
    height: calc(100vh - 80px - 80px);

    .info-area {
      .title {
        ${theme.fonts.h1};
        margin-bottom: 12px;
      }

      .description {
        span {
          ${theme.fonts.p3};
        }
      }

      .home-button {
        ${theme.fonts.p3};
      }
    }

    .asset-area {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default NotFound;
