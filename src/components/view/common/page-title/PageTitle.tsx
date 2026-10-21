import React from "react";
import styled from "styled-components";

import { FontsType } from "@/styles";

import Text from "@/components/ui/text";

interface PageTitleProps {
  title: string;
  type: FontsType;
  desktopType?: FontsType;
  // Shown next to the title, e.g. a total count.
  suffix?: React.ReactNode;
  description?: string;
}

export const PageTitle = ({ title, type, desktopType, suffix, description }: PageTitleProps) => {
  const heading = (
    <Title type={type} desktopType={desktopType} color="primary">
      {title}
    </Title>
  );

  if (!suffix && !description) return heading;

  return (
    <Wrapper>
      <TitleRow>
        {heading}
        {suffix}
      </TitleRow>
      {description && (
        <Text type="p4" color="tertiary">
          {description}
        </Text>
      )}
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

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
`;
