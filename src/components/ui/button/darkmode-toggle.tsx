import React from 'react';
import styled from 'styled-components';
import Moon from '@/assets/svgs/icon-moon.svg';
import Sun from '@/assets/svgs/icon-sun.svg';
import mixins from '@/styles/mixins';
import useTheme from '@/common/hooks/use-theme';

interface ToggleButtonProps {
  darkMode?: boolean;
  className?: string;
}

const DarkModeToggle = ({className}: ToggleButtonProps) => {
  const [themeMode, onChangeTheme] = useTheme();

  return (
    <Wrapper onClick={onChangeTheme} className={className}>
      <ToggleButton darkMode={themeMode === 'dark'}>
        {themeMode === 'dark' ? <Moon /> : <Sun />}
      </ToggleButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox('row', 'center', 'center')}
  position: relative;
  width: 60px;
  height: 32px;
  border-radius: 12px;
  background: ${({theme}) => theme.colors.surface};
  cursor: pointer;
`;

const ToggleButton = styled.div<ToggleButtonProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 22px;
  height: 22px;
  transition: all 0.2s ease;
  position: absolute;
  left: ${({darkMode}) => (darkMode ? '33px' : '5px')};
`;

export default DarkModeToggle;
