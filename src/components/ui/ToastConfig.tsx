import type { ReactNode } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BaseToastProps } from 'react-native-toast-message';

const TOAST_COLORS = {
  success: {
    bg: '#F0FFF4',
    border: '#38A169',
    icon: '#38A169',
    iconName: 'checkmark-circle' as const,
    titleColor: '#22543D',
    textColor: '#276749',
  },
  error: {
    bg: '#FFF5F5',
    border: '#E53E3E',
    icon: '#E53E3E',
    iconName: 'close-circle' as const,
    titleColor: '#742A2A',
    textColor: '#9B2C2C',
  },
  info: {
    bg: '#FFF5F7',
    border: '#E8446D',
    icon: '#E8446D',
    iconName: 'information-circle' as const,
    titleColor: '#702459',
    textColor: '#97266D',
  },
};

type ToastType = keyof typeof TOAST_COLORS;

function ToastCard({
  text1,
  text2,
  type = 'success',
  onPress,
}: BaseToastProps & { type?: string }) {
  const colors = TOAST_COLORS[(type as ToastType) in TOAST_COLORS ? (type as ToastType) : 'info'];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={colors.iconName} size={24} color={colors.icon} />
        </View>
        <View style={styles.textContainer}>
          {text1 ? (
            <Text style={[styles.title, { color: colors.titleColor }]} numberOfLines={1}>
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text style={[styles.message, { color: colors.textColor }]} numberOfLines={2}>
              {text2}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/**
 * Custom toast configuration for react-native-toast-message.
 * Pass this to <Toast config={toastConfig} /> in _layout.
 */
export const toastConfig = {
  success: (props: BaseToastProps) => <ToastCard {...props} type="success" />,
  error: (props: BaseToastProps) => <ToastCard {...props} type="error" />,
  info: (props: BaseToastProps) => <ToastCard {...props} type="info" />,
};

const styles = StyleSheet.create({
  wrapper: {
    width: '92%',
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 8 : 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderLeftWidth: 4,
    // Glass / frost effect
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.12)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    opacity: 0.85,
  },
});
