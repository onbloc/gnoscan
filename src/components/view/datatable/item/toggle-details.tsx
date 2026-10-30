import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import React from "react";
import styled from "styled-components";

interface Props {
  active: boolean;
  onClick: () => void;
}

export const ToggleDetails = ({ active, onClick }: Props) => {
  return (
    <ToggleDetailsWrapper type="button" className="ellipsis" aria-expanded={active} onClick={onClick}>
      <Badge className="badge" type="base" margin={"0"}>
        <Text type="p4" color="primary">
          {active ? "Hide" : "Details"}
        </Text>
      </Badge>
    </ToggleDetailsWrapper>
  );
};

const ToggleDetailsWrapper = styled.button`
  & {
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    height: auto;
    justify-content: flex-start;
    align-items: center;

    .badge {
      display: flex;
      width: 75px;
      max-width: 75px;
      border: 1px solid ${({ theme }) => theme.colors.pantone};
    }
  }
`;
