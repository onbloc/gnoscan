import React from "react";
import styled from "styled-components";

import { FontsType } from "@/styles";

import Text from "@/components/ui/text";

interface PageTitleProps {
  title: string;
  type: FontsType;
  desktopType?: FontsType;
}

export const PageTitle = ({ title, type, desktopType }: PageTitleProps) => {
  return (
    <Title type={type} desktopType={desktopType} color="primary">
      {title}
    </Title>
  );
};

const Title = styled(Text)``;
