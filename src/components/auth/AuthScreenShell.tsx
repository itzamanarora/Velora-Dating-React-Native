import type { ReactNode } from 'react';
import { Text as TText, YStack } from 'tamagui';
import {
  AuthAtmosphere,
  type AuthAtmosphereVariant,
  Body,
  BrandMark,
  FadeInView,
  GlassPanel,
  Heading,
  Screen,
} from '@/components/ui';

export type AuthScreenShellProps = {
  variant: AuthAtmosphereVariant;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Shared dating-chat auth layout: atmosphere + brand + glass card */
export function AuthScreenShell({
  variant,
  title,
  subtitle,
  children,
  footer,
}: AuthScreenShellProps) {
  return (
    <Screen scroll keyboard backgroundColor="$background" paddingHorizontal="$5">
      <AuthAtmosphere variant={variant} />

      <YStack f={1} justifyContent="center" gap="$5" maxWidth={420} width="100%" alignSelf="center" paddingVertical="$6">
        <FadeInView delay={0} from="down" alignItems="center" gap="$3">
          <BrandMark sizeVariant="md">
            <TText color="$primaryText" fontSize={28} fontWeight="800" letterSpacing={-1}>
              V
            </TText>
          </BrandMark>
          <YStack alignItems="center" gap="$1.5" paddingHorizontal="$2">
            <Heading level={2} color="$color" textAlign="center">
              {title}
            </Heading>
            <Body color="$muted" textAlign="center">
              {subtitle}
            </Body>
          </YStack>
        </FadeInView>

        <FadeInView delay={100} from="up">
          <GlassPanel intensity={0.78} borderRadius={28} padding={24}>
            {children}
          </GlassPanel>
        </FadeInView>

        {footer ? (
          <FadeInView delay={200} from="up" alignItems="center">
            {footer}
          </FadeInView>
        ) : null}
      </YStack>
    </Screen>
  );
}
