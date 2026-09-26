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

  return base
    .delay(delay)
    .duration(duration)
    .springify()
    .damping(16);
}

/**
 * Reusable entrance animation wrapper.
 * Use for staggered reveals on screens.
 */
export function FadeInView({
  children,
  delay = 0,
  from = 'up',
  duration = 520,
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