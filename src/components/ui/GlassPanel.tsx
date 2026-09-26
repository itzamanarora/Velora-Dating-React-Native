import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { YStack } from 'tamagui';

export type GlassPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Extra opacity for the frosted fill (0–1). Default 0.72 */
  intensity?: number;
  borderRadius?: number;
  padding?: number;
};

type WebViewStyle = ViewStyle & {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
};

/**
 * Light frosted-glass panel.
 * - iOS (liquid glass): native GlassView
 * - Web: CSS backdrop-filter blur
 * - Android / fallback: translucent blue-tinted frost
 */
export function GlassPanel({
  children,
  style,
  intensity = 0.72,
  borderRadius = 24,
  padding = 24,
}: GlassPanelProps) {
  const useNativeGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

  if (useNativeGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme="light"
        tintColor="rgba(252, 232, 238, 0.55)"
        style={[styles.base, { borderRadius, padding, overflow: 'hidden' }, style]}
      >
        {children}
      </GlassView>
    );
  }

  const frostStyle: WebViewStyle = {
    borderRadius,
    padding,
    backgroundColor: `rgba(255, 255, 255, ${intensity})`,
  };

  if (Platform.OS === 'web') {
    frostStyle.backdropFilter = 'blur(28px) saturate(160%)';
    frostStyle.WebkitBackdropFilter = 'blur(28px) saturate(160%)';
  }

  return (
    <View style={[styles.base, styles.frost, frostStyle, style]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.blueWash, { borderRadius }]} />
      <YStack zIndex={1} width="100%">
        {children}
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    overflow: 'hidden',
  },
  frost: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#C42E50',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  blueWash: {
    backgroundColor: 'rgba(232, 68, 109, 0.06)',
  },
});
