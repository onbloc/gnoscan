"use client";
import React, { useCallback } from "react";
import styled, { CSSProperties } from "styled-components";
import { useRecoilState } from "recoil";

import { useRouter } from "@/common/hooks/common/use-router";
import { searchState } from "@/states";

import mixins from "@/styles/mixins";
import Text from "@/components/ui/text";
import { MainInput, SubInput } from "@/components/ui/input";
import { debounce } from "@/common/utils/string-util";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { RiseIn, StretchOut } from "@/components/ui/animation/Animation";
import { FontsType } from "@/styles";

interface TextStyleProps {
  type: FontsType;
  color: string;
  textAlign: CSSProperties["textAlign"];
}

export const BtmNav = () => {
  const { isDesktop } = useWindowSize();
  const router = useRouter();
  const entry = router.route === "/";
  const [value, setValue] = useRecoilState(searchState);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(setValue(e.target.value), 1000);
    },
    [value],
  );

  const clearValue = () => {
    setValue("");
  };

  const textStyleProps: TextStyleProps = {
    type: isDesktop ? "h1" : "h2",
    color: "white",
    textAlign: "center",
  };

  return (
    <>
      {entry ? (
        <Wrapper isMain={entry}>
          <RiseIn>
            <Text {...textStyleProps}>The gno.land Blockchain Explorer</Text>
          </RiseIn>
          <StretchOut delay={0.5}>
            <MainInput
              className="main-search"
              value={value}
              setValue={setValue}
              onChange={onChange}
              clearValue={clearValue}
            />
          </StretchOut>
        </Wrapper>
      ) : (
        !isDesktop && (
          <Wrapper isMain={entry}>
            <SubInput value={value} onChange={onChange} clearValue={clearValue} />
          </Wrapper>
        )
      )}
    </>
  );
};

const Wrapper = styled.div<{ isMain: boolean }>`
  ${mixins.flexbox("column", "center", "center")};
  position: relative;
  height: ${({ isMain }) => (isMain ? "256px" : "64px")};
  padding: ${({ isMain }) => !isMain && "8px 0px 16px"};
  width: 100%;
  .main-search {
    width: 100%;
    max-width: 910px;
    margin-top: 14px;
  }
`;
