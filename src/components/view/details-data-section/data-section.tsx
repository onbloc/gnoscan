import React from "react";
import Text from "@/components/ui/text";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";

interface DataSectionProps {
  children: React.ReactNode;
  title: string;
}

const DataSection = ({ children, title }: DataSectionProps) => {
  return (
    <DetailsContainer>
      <Text type="h6" desktopType="h4" color="primary" margin="0 0 16px 0">
        {title}
      </Text>
      {children}
    </DetailsContainer>
  );
};

export default DataSection;
