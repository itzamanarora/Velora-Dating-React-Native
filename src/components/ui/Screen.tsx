import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, type GetProps } from 'tamagui';

type YStackProps = GetProps<typeof YStack>;

export type ScreenProps = YStackProps & {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  scrollProps?: ScrollViewProps;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({
  children,
  scroll = false,
  keyboard = false,
  scrollProps,
  edges = ['top', 'bottom'],
  backgroundColor = '$background',
  ...stackProps
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? Math.max(insets.bottom, 16) : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      <YStack
        f={1}
        backgroundColor={backgroundColor}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        {...stackProps}
      >
        {children}
      </YStack>
    </ScrollView>
  ) : (
    <YStack
      f={1}
      backgroundColor={backgroundColor}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      {...stackProps}
    >
      {children}
    </YStack>
  );

  if (keyboard) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
