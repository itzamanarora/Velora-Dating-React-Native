import type { ReactNode } from 'react';

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  type BaseAnimationBuilder,
  type EntryExitAnimationFunction,
} from 'react-native-reanimated';

import { YStack, type GetProps } from 'tamagui';

type Entering =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | any;

type YStackProps = GetProps<typeof YStack>;

export type FadeInViewProps = YStackProps & {
  children: ReactNode;

  /** Stagger delay in ms */
  delay?: number;

  /** Entrance direction */
  from?: 'up' | 'down' | 'none';

  duration?: number;
};

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

function getEntering(
  from: FadeInViewProps['from'],
  delay: number,
  duration: number,
): Entering {
  const base =
    from === 'up' ? FadeInUp : from === 'down' ? FadeInDown : FadeIn;

  // Soft timing only — no spring bounce
  return base.delay(delay).duration(duration);
}

/**
 * Reusable entrance animation wrapper.
 * Keep motion subtle — short fade, minimal travel.
 */
export function FadeInView({
  children,
  delay = 0,
  from = 'none',
  duration = 280,
  ...props
}: FadeInViewProps) {
  return (
    <AnimatedYStack
      entering={getEntering(from, delay, duration)}
      {...props}
    >
      {children}
    </AnimatedYStack>
  );
}