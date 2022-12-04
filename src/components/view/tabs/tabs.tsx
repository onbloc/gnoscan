import mixins from '@/styles/mixins';
import {useState} from 'react';
import styled, {css} from 'styled-components';

const data = [
  {
    id: 0,
    title: 'misc.gno',
    description: 'Tab 1',
  },
  {
    id: 1,
    title: 'boards.gno',
    description: 'Tab 2',
  },
];

const Tabs = () => {
  const [index, setIndex] = useState(0);

  return (
    <Wrapper>
      <ul>
        {data.map((v: any) => (
          <List key={v.id} active={v.id === index} onClick={() => setIndex(v.id)}>
            {v.title}
          </List>
        ))}
      </ul>
      <Content hasRadius={index === 0}>
        <p>{data[index].description}</p>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  ${mixins.flexbox('column', 'center', 'center')};
  width: 100%;
  color: #ffffff;
  ul {
    width: 100%;
    ${mixins.flexbox('row', 'center', 'flex-start')};
  }
`;

const List = styled.li<{active: boolean}>`
  padding: 12px 16px;
  height: 44px;
  transition: all 0.2s ease-in;
  ${({active, theme}) =>
    active &&
    css`
      background-color: ${theme.colors.surface};
    `}
`;

const Content = styled.div<{hasRadius: boolean}>`
  width: 100%;
  height: 508px;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  border-top-left-radius: ${({hasRadius}) => (hasRadius ? '0px' : '10px')};
  transition: all 0.2s ease-in;
`;

export default Tabs;
