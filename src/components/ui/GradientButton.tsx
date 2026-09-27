import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'tamagui';

export type GradientButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

/** Primary CTA — pink → yellow gradient. */
export function GradientButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        fullWidth ? styles.fullWidth : undefined,
        { opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={['#E8446D', '#F5A623']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text color="#FFFFFF" fontSize={16} fontWeight="700" letterSpacing={0.2}>
            {children}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  gradient: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
