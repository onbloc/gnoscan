import React from "react";
import styled from "styled-components";

import { FontsType } from "@/styles";

import Text from "@/components/ui/text";

interface PageTitleProps {
  title: string;
  type: FontsType;
}

export const PageTitle = ({ title, type }: PageTitleProps) => {
  return (
    <Title type={type} color="primary">
      {title}
    </Title>
  );
};

const Title = styled(Text)``;
