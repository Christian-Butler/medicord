/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('screen');

const tintColorLight = '#5085A8';
const tintColorDark = '#fff';

export const Colors = {
  bg1: '#EEF9FB',
  bg2: 'white',
  primary: '#5085A8',
  secondary: '#0D5175',
  text: '#11181C',
  textMuted: '#7B8A91',
  success: '#17A633',
  warning: '#e7b709',
  error: '#B10111',
  delete: '#d31f1f',
  edit: '#8A3F00',

  light: {
    text: '#11181C',
    background: '#fffcfc',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Sizes = {
  h1: 30,
  h2: 26,
  h3: 22,
  h4: 20,
  h5: 18,
  paragraph: 16,
  sm: 14,
  xs: 12,
  imgNm: 64,
  imgApt: 58,
  boxW: 70,
  boxH: 70,
  p0: 4,
  p1: 6,
  p2: 10,
  p3: 12,
  width,
  height,
}

export const Buttons = {
  primary: {
    background: Colors.primary,
    textColor: '#fff',
    borderRadius: 14,
    height: 50,
  },
  secondary: {
    textColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 12,
  },
  tertiary: {
    textColor: Colors.primary,
  },
  primaryVariant: {
    background: Colors.success,
    textColor: '#fff',
    borderRadius: 14,
    height: 50,
  },
  secondaryVariant: {
  },
  delete: {

  },
  deleteVariant: {
    icon: Colors.delete,
    background: '#fff',
    radius: 14,
  }
}

export const Icons = {
  normal: {
    size: 34
  },
  small: {

  },
  large: {

  },
  extraLarge: {

  },
  warning: {
    icon: 'red',
  },
  modify: {

  }
}

export const Inputs = {
  normal: {
    height: 50,
    width: 1,
  },
  small: {

  },
  large: {

  }
}



export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
