import React from 'react';
import Text from '@/components/ui/text';
import {DetailsContainer} from '@/components/ui/detail-page-common-styles';
import {isDesktop} from '@/common/hooks/use-media';

interface DataSectionProps {
  children: React.ReactNode;
  title: string;
}

const DataSection = ({children, title}: DataSectionProps) => {
  const desktop = isDesktop();
  return (
    <DetailsContainer desktop={desktop}>
      <Text
        type={desktop ? 'h4' : 'h6'}
        color="primary"
        margin={desktop ? '0 0 16px 0' : '0 0 16px 0'}>
        {title}
      </Text>
      {children}
    </DetailsContainer>
  );
};

export default DataSection;
