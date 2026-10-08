import { media } from "@/common/values/ui.constant";
import mixins from "@/styles/mixins";
import { useState } from "react";
import styled, { css } from "styled-components";
import { v1 } from "uuid";
import Text from "@/components/ui/text";

interface TabsProps {
  files: {
    name: string;
    body: string;
  }[];
}

interface StyleProps {
  hasRadius?: boolean;
  active?: boolean;
}

const Tabs = ({ files }: TabsProps) => {
  const [index, setIndex] = useState(0);

  return (
    <Wrapper>
      <ul>
        {files.map((file, i) => (
          <List key={v1()} active={i === index} onClick={() => setIndex(i)}>
            {file.name}
          </List>
        ))}
      </ul>
      <Content hasRadius={index === 0}>
        <Text type="p4" color="primary" className="inner-content">
          {files[index].body}
        </Text>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  ${mixins.flexbox("column", "center", "center")};
  ${({ theme }) => theme.fonts.p4};
  width: 100%;
  color: ${({ theme }) => theme.colors.reverse};
  ul {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
  }
`;

const List = styled.li<StyleProps>`
  padding: 12px 16px;
  height: 44px;
  cursor: pointer;
  color: ${({ active, theme }) => !active && theme.colors.tertiary};
  &:last-of-type {
    border-top-right-radius: 10px;
  }
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  ${({ active, theme }) =>
    active &&
    css`
      background-color: ${theme.colors.surface};
    `}
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  height: 290px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  border-top-left-radius: 0px;
  overflow: hidden;
  .inner-content {
    padding: 16px;
    overflow: auto;
    width: 100%;
    height: auto;
  }
  ${media.DESKTOP} {
    height: 508px;
    .inner-content {
      padding: 24px;
    }
  }
`;

export default Tabs;
