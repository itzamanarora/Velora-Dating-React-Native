import { createAnimations } from '@tamagui/animations-react-native';
import { getDefaultTamaguiConfig } from '@tamagui/config-default';
import { createFont, createTamagui, createTokens } from 'tamagui';

const defaultConfig = getDefaultTamaguiConfig('native');

const animations = createAnimations({
  '100ms': { type: 'timing', duration: 100 },
  '200ms': { type: 'timing', duration: 200 },
  bouncy: { damping: 9, mass: 0.9, stiffness: 150 },
  lazy: { damping: 18, stiffness: 50 },
  medium: { damping: 15, stiffness: 120, mass: 1 },
  slow: { damping: 20, stiffness: 60 },
  quick: { damping: 20, mass: 1.2, stiffness: 250 },
  tooltip: { damping: 10, mass: 0.9, stiffness: 100 },
});

const interFont = createFont({
  family: 'System',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    true: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 22,
    true: 22,
    5: 24,
    6: 26,
    7: 28,
    8: 32,
    9: 40,
    10: 54,
    11: 66,
    12: 74,
    13: 86,
    14: 110,
    15: 136,
    16: 160,
  },
  weight: {
    1: '300',
    2: '300',
    3: '400',
    4: '400',
    true: '400',
    5: '500',
    6: '600',
    7: '700',
    8: '700',
    9: '800',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    true: 0,
    5: 0,
    6: -0.2,
    7: -0.3,
    8: -0.4,
    9: -0.6,
    10: -1,
  },
});

const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    white: '#FFFFFF',
    black: '#0B1220',
    // Brand — Velora romantic rose
    brand50: '#FFF5F7',
    brand100: '#FFF0F3',
    brand200: '#FFCCD5',
    brand300: '#FF99AC',
    brand400: '#FF6B81',
    brand500: '#E8446D',
    brand600: '#D63A5E',
    brand700: '#C42E50',
    brand800: '#9B8A8E',
    brand900: '#756A6D',
    // Neutrals
    gray50: '#F7F9FC',
    gray100: '#EEF2F7',
    gray200: '#D9E1EC',
    gray300: '#B8C4D4',
    gray400: '#8A9BB0',
    gray500: '#5C6F86',
    gray600: '#3D4F66',
    gray700: '#2A3A4F',
    gray800: '#1A2738',
    gray900: '#0F1824',
    // Semantic
    success: '#1F9D6C',
    warning: '#D97706',
    danger: '#DC3D4B',
    dangerSoft: '#FDECEE',
  },
});

const lightTheme = {
  // Soft rose-tinted light canvas
  background: '#FFF5F7',
  backgroundHover: tokens.color.brand50,
  backgroundPress: tokens.color.brand100,
  backgroundFocus: tokens.color.brand50,
  backgroundStrong: tokens.color.white,
  backgroundTransparent: 'rgba(255,245,247,0)',
  color: tokens.color.gray900,
  colorHover: tokens.color.gray800,
  colorPress: tokens.color.gray700,
  colorFocus: tokens.color.gray800,
  colorTransparent: 'rgba(15,24,36,0)',
  borderColor: '#F0D5DA',
  borderColorHover: '#E8B4BE',
  borderColorPress: tokens.color.brand300,
  borderColorFocus: tokens.color.brand500,
  placeholderColor: '#C4A0A8',
  outlineColor: tokens.color.brand200,
  // Brand aliases
  primary: tokens.color.brand500,
  primaryHover: tokens.color.brand600,
  primaryPress: tokens.color.brand700,
  primaryText: tokens.color.white,
  secondary: tokens.color.brand100,
  secondaryHover: tokens.color.brand200,
  secondaryPress: tokens.color.brand300,
  secondaryText: tokens.color.brand500,
  muted: tokens.color.brand800,
  mutedBackground: 'rgba(232, 68, 109, 0.08)',
  surface: 'rgba(255, 255, 255, 0.78)',
  surfaceHover: tokens.color.white,
  danger: tokens.color.danger,
  dangerBackground: tokens.color.dangerSoft,
  success: tokens.color.success,
  shadowColor: 'rgba(232, 68, 109, 0.08)',
};

const darkTheme = {
  background: tokens.color.gray900,
  backgroundHover: tokens.color.gray800,
  backgroundPress: tokens.color.gray700,
  backgroundFocus: tokens.color.gray800,
  backgroundStrong: tokens.color.gray800,
  backgroundTransparent: 'rgba(0,0,0,0)',
  color: tokens.color.gray50,
  colorHover: tokens.color.gray100,
  colorPress: tokens.color.gray200,
  colorFocus: tokens.color.gray100,
  colorTransparent: 'rgba(247,249,252,0)',
  borderColor: tokens.color.gray700,
  borderColorHover: tokens.color.gray600,
  borderColorPress: tokens.color.gray500,
  borderColorFocus: tokens.color.brand400,
  placeholderColor: tokens.color.gray500,
  outlineColor: tokens.color.brand700,
  primary: tokens.color.brand400,
  primaryHover: tokens.color.brand300,
  primaryPress: tokens.color.brand500,
  primaryText: tokens.color.white,
  secondary: tokens.color.gray800,
  secondaryHover: tokens.color.gray700,
  secondaryPress: tokens.color.gray600,
  secondaryText: tokens.color.gray100,
  muted: tokens.color.gray400,
  mutedBackground: tokens.color.gray800,
  surface: tokens.color.gray800,
  surfaceHover: tokens.color.gray700,
  danger: tokens.color.danger,
  dangerBackground: '#3A1519',
  success: tokens.color.success,
  shadowColor: 'rgba(232, 68, 109, 0.2)',
};

const tamaguiConfig = createTamagui({
  animations,
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    heading: interFont,
    body: interFont,
  },
  media: defaultConfig.media,
  shorthands: defaultConfig.shorthands,
  settings: {
    ...defaultConfig.settings,
    defaultFont: 'body',
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
