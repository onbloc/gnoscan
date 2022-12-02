import {eachMedia} from '@/common/hooks/use-media';
import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';

interface StyleProps {
  media: string;
}

interface DetailsLayoutProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

export const DetailsPageLayout = ({children, title}: DetailsLayoutProps) => {
  const media = eachMedia();
  return (
    <Wrapper media={media}>
      <div className="inner-layout">
        <Content media={media}>
          <Text
            type={media === 'desktop' ? 'h2' : 'p2'}
            color="primary"
            margin={media === 'desktop' ? '0px 0px 24px' : '0px 0px 16px'}>
            {title}
          </Text>
          {children}
        </Content>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main<StyleProps>`
  width: 100%;
  flex: 1;
  padding: ${({media}) => (media === 'desktop' ? '40px 0px' : '24px 0px')};
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  padding: ${({media}) => (media === 'desktop' ? '24px' : '16px')};
`;
