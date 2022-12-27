import {isDesktop} from '@/common/hooks/use-media';
import mixins from '@/styles/mixins';
import theme from '@/styles/theme';
import {useState} from 'react';
import styled, {css} from 'styled-components';
import {v1} from 'uuid';
import Text from '@/components/ui/text';

export type LogDataType = {
  list: string[];
  content: string[];
};
interface TabsProps {
  logData: LogDataType;
}

interface StyleProps {
  hasRadius?: boolean;
  active?: boolean;
  desktop?: boolean;
}

const Tabs = ({logData}: TabsProps) => {
  const desktop = isDesktop();
  const [index, setIndex] = useState(0);

  return (
    <Wrapper>
      <ul>
        {logData.list.map((v: string, i: number) => (
          <List key={v1()} active={i === index} onClick={() => setIndex(i)}>
            {v}
          </List>
        ))}
      </ul>
      <Content hasRadius={index === 0} desktop={desktop}>
        <Text type="p4" color="primary" className="inner-content">
          {logData.content[index]}
        </Text>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  ${mixins.flexbox('column', 'center', 'center')};
  ${({theme}) => theme.fonts.p4};
  width: 100%;
  color: ${({theme}) => theme.colors.reverse};
  ul {
    width: 100%;
    ${mixins.flexbox('row', 'center', 'flex-start')};
  }
`;

const List = styled.li<StyleProps>`
  padding: 12px 16px;
  height: 44px;
  cursor: pointer;
  color: ${({active, theme}) => !active && theme.colors.tertiary};
  &:last-of-type {
    border-top-right-radius: 10px;
  }
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  ${({active, theme}) =>
    active &&
    css`
      background-color: ${theme.colors.surface};
    `}
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  height: ${({desktop}) => (desktop ? '508px' : '290px')};
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  border-top-left-radius: 0px;
  overflow: hidden;
  .inner-content {
    padding: ${({desktop}) => (desktop ? '24px' : '16px')};
    overflow: auto;
    width: 100%;
    height: auto;
  }
`;

export default Tabs;
