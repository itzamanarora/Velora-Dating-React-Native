import { Body, FadeInView, Heading, Screen } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

export type SetupShellProps = {
  step: 1 | 2 | 3 | 4 | 5 | 6 ;
  title: string;
  subtitle: string;
  children: ReactNode;
  showBack?: boolean;
};

const STEP_LABELS = ['Name', 'Birthday', 'Gender', 'Preference', 'Bio', 'Photo'] as const;

/** Shared layout for the 4-step profile setup. */
export function SetupShell({
  step,
  title,
  subtitle,
  children,
  showBack = true,
}: SetupShellProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen scroll keyboard backgroundColor="#FFFFFF" paddingHorizontal="$5">
      <YStack
        f={1}
        maxWidth={440}
        width="100%"
        alignSelf="center"
        paddingTop="$2"
        paddingBottom="$4"
        gap="$5"
      >
        <XStack alignItems="center" justifyContent="space-between" minHeight={40}>
          {showBack ? (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
            >
              <Ionicons name="chevron-back" size={26} color="#0F1824" />
            </Pressable>
          ) : (
            <YStack width={34} />
          )}
          <CaptionStep />
          <YStack width={34} />
        </XStack>

        <XStack gap="$2" justifyContent="center">
          {STEP_LABELS.map((label, i) => {
            const active = i + 1 === step;
            const done = i + 1 < step;
            return (
              <YStack key={label} f={1} alignItems="center" gap="$1.5">
                <YStack
                  height={4}
                  width="100%"
                  borderRadius={999}
                  backgroundColor={active || done ? '#E8446D' : '#F0D5DA'}
                />
                <Text
                  fontSize={11}
                  fontWeight={active ? '700' : '500'}
                  color={active || done ? '#E8446D' : '#9B8A8E'}
                >
                  {label}
                </Text>
              </YStack>
            );
          })}
        </XStack>

        <FadeInView delay={0} from="none" gap="$2">
          <Heading level={2} color="#0F1824" fontSize={24} fontWeight="700">
            {title}
          </Heading>
          <Body color="#756A6D" fontSize={15} lineHeight={22}>
            {subtitle}
          </Body>
        </FadeInView>

        <FadeInView delay={40} from="none" f={1} gap="$4">
          {children}
        </FadeInView>

        <Text
          color="#9B8A8E"
          fontSize={12}
          textAlign="center"
          marginBottom={insets.bottom > 0 ? 0 : '$2'}
        >
          Step {step} of 6 — this helps others find the real you.
        </Text>
      </YStack>
    </Screen>
  );
}

function CaptionStep() {
  return (
    <Text color="#756A6D" fontSize={13} fontWeight="600">
      Profile setup
    </Text>
  );
}
