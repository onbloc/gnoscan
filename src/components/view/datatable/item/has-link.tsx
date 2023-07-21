import {PaletteKeyType, FontsType} from '@/styles';
import Link from 'next/link';
import React from 'react';
import Text from '@/components/ui/text';
import styled from 'styled-components';

interface Props {
  text: string;
  textSize?: FontsType;
  path: string;
  color?: PaletteKeyType;
}

export const HasLink = ({text, textSize = 'p4', path, color = 'blue'}: Props) => {
  return (
    <Link href={path} passHref>
      <StyledA>
        <Text type={textSize} color={color}>
          {text}
        </Text>
      </StyledA>
    </Link>
  );
};

const StyledA = styled.a`
  width: 100%;
  max-width: fit-content;
`;
