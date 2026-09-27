import type { ReactNode } from 'react';
import { YStack } from 'tamagui';
import {
  AppLogo,
  Body,
  FadeInView,
  Heading,
  Screen,
} from '@/components/ui';

export type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** `split` = logo/title centered, form anchored to bottom (login). */
  layout?: 'default' | 'split';
  /** Logo name color — black on white auth screens. */
  logoNameColor?: string;
};

/** Clean white auth layout — no orbs / glass. */
export function AuthScreenShell({
  title,
  subtitle,
  children,
  footer,
  layout = 'default',
  logoNameColor = '#0F1824',
}: AuthScreenShellProps) {
  const brand = (
    <FadeInView delay={0} from="none" alignItems="center" gap="$3">
      <AppLogo size={layout === 'split' ? 80 : 64} nameColor={logoNameColor} />
      <YStack alignItems="center" gap="$1.5" paddingHorizontal="$2">
        <Heading level={2} color="#0F1824" textAlign="center" fontSize={22} fontWeight="700">
          {title}
        </Heading>
        {subtitle ? (
          <Body color="#756A6D" textAlign="center" fontSize={14}>
            {subtitle}
          </Body>
        ) : null}
      </YStack>
    </FadeInView>
  );

  if (layout === 'split') {
    return (
      <Screen keyboard backgroundColor="#FFFFFF" paddingHorizontal="$5">
        <YStack f={1} width="100%" maxWidth={420} alignSelf="center">
          <YStack f={1} justifyContent="center" alignItems="center">
            {brand}
          </YStack>

          <FadeInView delay={40} from="none" gap="$4" paddingBottom="$2">
            {children}
            {footer ? (
              <YStack alignItems="center" paddingTop="$1">
                {footer}
              </YStack>
            ) : null}
          </FadeInView>
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen scroll keyboard backgroundColor="#FFFFFF" paddingHorizontal="$5">
      <YStack
        f={1}
        justifyContent="center"
        gap="$5"
        maxWidth={420}
        width="100%"
        alignSelf="center"
        paddingVertical="$6"
      >
        {brand}

        <FadeInView delay={40} from="none">
          {children}
        </FadeInView>

        {footer ? (
          <FadeInView delay={60} from="none" alignItems="center">
            {footer}
          </FadeInView>
        ) : null}
      </YStack>
    </Screen>
  );
}
