import baseStyled, {
  css,
  FlattenSimpleInterpolation,
  ThemedStyledInterface,
} from 'styled-components';

const lightTheme: Palette = {
  main: '#FFF000',
  orange: '#FF7600',
  wine: '#66002E',
  crimson: '#CD0035',
  blue: '#2090F3',
  white: '#FFFFFF',
  reverse: '#000000',
  primary: '#333333',
  secondary: '#666666',
  tertiary: '#999999',
  base: '#F7F7F7',
  surface: '#FFFFFF',
  select: '#F2F2F2',
  pantone: '#DFDFDF',
  dimmed50: 'rgba(0, 0, 0, 0.05)',
  dimmed100: 'rgba(255, 255, 255, 0.1)',
  dimmed200: 'rgba(255, 255, 255, 0.2)',
  dimmed600: 'rgba(0, 0, 0, 0.6)',
} as const;

const darkTheme: Palette = {
  main: '#FFF000',
  orange: '#FF7600',
  wine: '#66002E',
  crimson: '#CD0035',
  blue: '#2090F3',
  white: '#FFFFFF',
  reverse: '#FFFFFF',
  primary: '#FFFFFF',
  secondary: '#F6F6F6',
  tertiary: '#A0A0A0',
  base: '#121212',
  surface: '#232323',
  select: '#121212',
  pantone: '#292929',
  dimmed50: 'rgba(255, 255, 255, 0.05)',
  dimmed100: 'rgba(255, 255, 255, 0.1)',
  dimmed200: 'rgba(255, 255, 255, 0.2)',
  dimmed600: 'rgba(0, 0, 0, 0.6)',
} as const;

const fonts: FontsKeyType = {
  h1: css`
    font-size: 44px;
    font-weight: 700;
    line-height: 60px;
  `,
  h2: css`
    font-size: 28px;
    font-weight: 700;
    line-height: 36px;
  `,
  h3: css`
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;
  `,
  h4: css`
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  `,
  h5: css`
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
  `,
  h6: css`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  `,
  h7: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  `,
  h8: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  `,
  p1: css`
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  `,
  p2: css`
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
  `,
  p3: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  `,
  p4: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  `,
  body1: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  `,
  body2: css`
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
  `,
} as const;

export type FontsType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'h8'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'body1'
  | 'body2';

export type PaletteKeyType =
  | 'main'
  | 'orange'
  | 'wine'
  | 'crimson'
  | 'blue'
  | 'white'
  | 'reverse'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'base'
  | 'surface'
  | 'select'
  | 'pantone'
  | 'dimmed50'
  | 'dimmed100'
  | 'dimmed200'
  | 'dimmed600';

const device: DeviceValueType = {
  desktop: '(minWidth: 1280)',
  tablet: '((min-width: 768px) and (max-width: 1279px))',
  mobile: '(maxWidth: 767)',
} as const;

type FontsKeyType = {[key in FontsType]: FlattenSimpleInterpolation};
type PaletteLightType = typeof lightTheme;
type PaletteDarkType = typeof darkTheme;
type DeviceType = 'desktop' | 'tablet' | 'mobile';
type DeviceValueType = {[key in DeviceType]: string};
export type Palette = {[key in PaletteKeyType]: string};
export type PaletteLightValueType = PaletteLightType[PaletteKeyType];
export type PaletteDarkTypeValueType = PaletteDarkType[PaletteKeyType];

export type ThemeType = {
  lightTheme: PaletteLightType;
  darkTheme: PaletteDarkType;
  fonts: FontsKeyType;
  device: DeviceValueType;
};

const theme: ThemeType = {
  lightTheme,
  darkTheme,
  fonts,
  device,
} as const;

export const styled = baseStyled as ThemedStyledInterface<ThemeType>;

export default theme;
