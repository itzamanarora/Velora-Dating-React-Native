import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type BlurBackdropProps = {
  children?: ReactNode;
  /** Frost strength 0–1 for fallback; mapped to BlurView intensity when expo-blur exists */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
};

type WebViewStyle = ViewStyle & {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
};

type BlurViewComponent = React.ComponentType<{
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}>;

function getExpoBlurView(): BlurViewComponent | null {
  try {
    // Optional — install with: npx expo install expo-blur
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-blur') as { BlurView?: BlurViewComponent };
    return mod.BlurView ?? null;
  } catch {
    return null;
  }
}

/**
 * Soft frosted blur layer for light theme screens.
 * Prefers expo-blur when installed; otherwise translucent blue wash (+ CSS blur on web).
 */
export function BlurBackdrop({ children, intensity = 0.55, style }: BlurBackdropProps) {
  const ExpoBlur = getExpoBlurView();

  if (ExpoBlur) {
    return (
      <ExpoBlur
        intensity={Math.round(intensity * 80)}
        tint="light"
        style={[StyleSheet.absoluteFill, style]}
      >
        {children}
      </ExpoBlur>
    );
  }

  const frostStyle: WebViewStyle = {
    backgroundColor: `rgba(252, 232, 238, ${intensity})`,
  };

  if (Platform.OS === 'web') {
    frostStyle.backdropFilter = 'blur(40px) saturate(150%)';
    frostStyle.WebkitBackdropFilter = 'blur(40px) saturate(150%)';
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, frostStyle, style]}>
      {children}
    </View>
  );
}
