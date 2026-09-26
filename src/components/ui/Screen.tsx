import { useState, useCallback, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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
  /** Pull-to-refresh callback — pass to enable swipe-down refresh */
  onRefresh?: () => Promise<void> | void;
};

export function Screen({
  children,
  scroll = false,
  keyboard = false,
  scrollProps,
  edges = ['top', 'bottom'],
  backgroundColor = '$background',
  onRefresh,
  ...stackProps
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? Math.max(insets.bottom, 16) : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="#E8446D"
      colors={['#E8446D']}
      progressBackgroundColor="#FFF5F7"
    />
  ) : undefined;

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
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
