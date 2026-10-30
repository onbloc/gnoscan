import React from "react";
import styled from "styled-components";

import { FontsType } from "@/styles";

import Text from "@/components/ui/text";

interface PageTitleProps {
  title: string;
  type: FontsType;
  desktopType?: FontsType;
  description?: string;
}

export const PageTitle = ({ title, type, desktopType, description }: PageTitleProps) => {
  const heading = (
    <Title type={type} desktopType={desktopType} color="primary">
      {title}
    </Title>
  );

  if (!description) return heading;

  return (
    <Wrapper>
      {heading}
      <Text type="p3" color="tertiary">
        {description}
      </Text>
    </Wrapper>
  );
};

const Title = styled(Text)``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;
