import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'display'
  | 'title'
  | 'heading'
  | 'body'
  | 'bodyBold'
  | 'small'
  | 'smallBold'
  | 'caption'
  | 'overline'
  | 'link'
  | 'code'
  // Deprecated aliases, kept so unmigrated screens keep compiling.
  | 'default'
  | 'pageTitle'
  | 'subtitle'
  | 'linkPrimary';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

const ALIASES: Partial<Record<ThemedTextType, ThemedTextType>> = {
  default: 'body',
  pageTitle: 'title',
  subtitle: 'heading',
  linkPrimary: 'link',
};

/** Caps how far Dynamic Type can scale each step before layouts break. */
const MAX_SCALE: Partial<Record<ThemedTextType, number>> = {
  display: 1.3,
  title: 1.3,
  heading: 1.4,
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const resolved = ALIASES[type] ?? type;

  return (
    <Text
      maxFontSizeMultiplier={MAX_SCALE[resolved] ?? 1.6}
      style={[
        { color: theme[themeColor ?? 'textPrimary'] },
        resolved === 'link' && { color: theme.textLink },
        styles[resolved as keyof typeof styles],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  smallBold: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  link: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' as const }) ?? ('500' as const),
    fontSize: 12,
  },
});
