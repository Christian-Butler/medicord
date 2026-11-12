/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("screen");

const tintColorLight = '#5085A8';
const tintColorDark = '#fff';

export const Colors = {
  bg1: '#EEF9FB',
  bg2: 'white',
  primary: '#5085A8',
  secondary: '#0D5175',
  text: '#11181C',
  textMuted: '#67757c',
  success: '#17A633',
  successMuted: '#a2e5b062',
  info: '#e7bf3c',
  infoMuted: '#ffe9a87f',
  error: '#B10111',
  delete: '#d31f1f',
  edit: '#8A3F00',

  light: {
    text: '#11181C',
    background: '#fffcfc',
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: '#BEC9CA',
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
  imgNm: 64,
  imgApt: 56,
  IconNml: 34,
  IconLg: 46,
  IconXL: 64,
  BtnP: 50,
  boxS: 70,
  p0: 4,
  p1: 6,
  p2: 10,
  p3: 12,
  width,
  height,
}

export const Buttons = {
  imgW: 40,
  height: 50,
  w0: 1,
  w1: 1.5,
  w2: 2
}

export const Inputs = {
  height: 50,
  w0: 1,
  w1: 2,
}



export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
