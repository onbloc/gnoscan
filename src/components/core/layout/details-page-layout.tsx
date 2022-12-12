import {isDesktop} from '@/common/hooks/use-media';
import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import LoadingPage from '@/components/view/loading/page';
import NotFound from '@/components/view/not-found/not-found';
interface StyleProps {
  desktop?: boolean;
  titleAlign?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  visible?: boolean;
  keyword?: string;
  error?: boolean;
}
interface DetailsLayoutProps extends StyleProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  titleOption?: React.ReactNode;
}

export const DetailsPageLayout = ({
  children,
  title,
  titleOption,
  titleAlign = 'flex-start',
  visible,
  keyword = '',
  error,
}: DetailsLayoutProps) => {
  const desktop = isDesktop();

  return (
    <Wrapper>
      <div className="inner-layout">
        <LoadingPage visible={visible} />
        {!visible && error ? (
          <NotFound keyword={keyword} />
        ) : (
          <Content desktop={desktop} titleAlign={titleAlign} visible={!visible}>
            <Text
              type={desktop ? 'h2' : 'p2'}
              color="primary"
              margin={desktop ? '0px 0px 24px' : '0px 0px 16px'}
              className="content-text">
              {title}
              {titleOption && titleOption}
            </Text>
            {children}
          </Content>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  padding: ${({desktop}) => (desktop ? '24px' : '16px')};
  margin: ${({desktop}) => (desktop ? '40px 0px' : '24px 0px')};
  .content-text {
    ${({titleAlign}) => mixins.flexbox('row', 'center', titleAlign ?? 'center')};
  }
  ${({visible}) => !visible && 'display: none;'}
`;
