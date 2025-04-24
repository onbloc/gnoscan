import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Title type={"h2"} color="primary">
      {title}
    </Title>
  );
};

const Title = styled(Text)``;
