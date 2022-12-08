import {eachMedia} from '@/common/hooks/use-media';
import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import LoadingPage from '@/components/view/loading/page';

interface StyleProps {
  media?: string;
  titleAlign?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
}
interface DetailsLayoutProps extends StyleProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  titleOption?: React.ReactNode;
  isFetched: boolean;
}

export const DetailsPageLayout = ({
  children,
  title,
  titleOption,
  titleAlign = 'flex-start',
  isFetched,
}: DetailsLayoutProps) => {
  const media = eachMedia();
  return (
    <Wrapper media={media}>
      <div className="inner-layout">
        {isFetched ? (
          <Content media={media} titleAlign={titleAlign}>
            <Text
              type={media === 'desktop' ? 'h2' : 'p2'}
              color="primary"
              margin={media === 'desktop' ? '0px 0px 24px' : '0px 0px 16px'}
              className="content-text">
              {title}
              {titleOption && titleOption}
            </Text>
            {children}
          </Content>
        ) : (
          <LoadingPage visible={!isFetched} />
        )}
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
  .content-text {
    ${({titleAlign}) => mixins.flexbox('row', 'center', titleAlign ?? 'center')};
  }
`;
