import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import React from "react";
import styled from "styled-components";

interface Props {
  functions: string[];
}

export const Functions = ({ functions }: Props) => {
  return (
    <FunctionsWrapper className="ellipsis">
      {functions.map((func, index) => (
        <Badge className="function" type="blue" margin={"0px"} key={index}>
          <Text type="p4" color="white">
            {func}
          </Text>
        </Badge>
      ))}
    </FunctionsWrapper>
  );
};

const FunctionsWrapper = styled.span`
  & {
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    height: auto;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;

    &.ellipsis {
      display: block;
    }

    .function {
      margin-right: 8px;
    }
  }
`;
