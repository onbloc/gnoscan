/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import styled from "styled-components";
import mixins from "@/styles/mixins";
import { useRouter } from "@/common/hooks/common/use-router";
import { TopNav, BtmNav } from ".";

export const Header = () => {
  const { route } = useRouter();
  const entry = route === "/" && route !== null && route !== undefined;

  return (
    <>
      <Wrapper isMain={entry}>
        <div className="inner-layout">
          <TopNav />
          <BtmNav />
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.header<{ isMain: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  position: relative;
  background: ${({ isMain, theme }) =>
    isMain ? "url('/bg-header.svg') no-repeat center center" : theme.colors.surface};
  box-shadow: ${({ isMain }) => isMain && "0px 4px 4px rgba(0, 0, 0, 0.25)"};
  background-size: cover;
`;
