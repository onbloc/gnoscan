import theme, {PaletteKeyType} from '@/styles/theme';
import styled from 'styled-components';
import {Header} from '../header';

export interface Option<T> {
  themeMode?: string | any;
  colorName?: PaletteKeyType;
  width?: string;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  flex?: boolean;
  sort?: boolean;
  renderOption?: (value: any, data: T) => React.ReactNode;
}

export const headerOptionByHeader = <T extends {[key in string]: any}>(
  header: Header<T>,
): Option<T> => {
  return {
    themeMode: header.themeMode ?? 'light',
    colorName: 'primary',
    width: header.width ?? '100%',
    align: header.headerAlign ?? header.align ?? 'left',
    flex: header.flex ?? true,
    sort: header.sort ?? false,
    renderOption: header.renderOption,
  };
};

export const dataOptionByHeader = <T extends {[key in string]: any}>(
  header: Header<T>,
): Option<T> => {
  return {
    themeMode: header.themeMode ?? 'light',
    colorName: header.colorName ?? 'primary',
    width: header.width ?? '100%',
    align: header.align ?? 'left',
    flex: header.flex ?? true,
    sort: header.sort ?? false,
    renderOption: header.renderOption,
  };
};

export const ColumnOption = styled.div<{options: Option<any>}>`
  & {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-basis: auto;
    min-width: 0;
    height: 100%;
    padding: 16px;
    align-items: center;

    ${({options}) => optionColor(options.themeMode, options.colorName)};
    ${({options}) => optionWidth(options.width)};
    ${({options}) => optionFlex(options.flex)};
    ${({options}) => optionAlign(options.align)};

    .ellipsis {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`;

const optionColor = (themeMode?: string, colorName?: PaletteKeyType) => {
  const themeType = themeMode === 'dark' ? 'darkTheme' : 'lightTheme';
  const colorType = colorName ?? 'primary';
  return `color: ${theme[themeType][colorType]};`;
};

const optionWidth = (width?: string) => {
  return `width: ${width ?? '100%'};`;
};

const optionFlex = (flex?: boolean) => {
  return `flex-shrink: ${flex ? 1 : 0};`;
};

const optionAlign = (align?: 'left' | 'center' | 'right') => {
  let alignValue = 'flex-start';
  switch (align) {
    case 'left':
      alignValue = 'flex-start';
      break;
    case 'right':
      alignValue = 'flex-end';
      break;
    case 'center':
      alignValue = 'center';
      break;
    default:
      break;
  }
  return `justify-content: ${alignValue};`;
};
