import { YStack, styled, type GetProps } from 'tamagui';

export const Card = styled(YStack, {
  name: 'AppCard',
  backgroundColor: '$surface',
  borderRadius: '$7',
  padding: '$5',
  borderWidth: 1,
  borderColor: '$borderColor',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 24,
  elevationAndroid: 4,
  variants: {
    elevated: {
      true: {
        borderWidth: 0,
        shadowOpacity: 1,
        shadowRadius: 28,
        elevationAndroid: 6,
      },
      false: {
        shadowOpacity: 0,
        elevationAndroid: 0,
      },
    },
    padded: {
      none: { padding: 0 },
      sm: { padding: '$3' },
      md: { padding: '$4' },
      lg: { padding: '$5' },
    },
  } as const,
  defaultVariants: {
    elevated: true,
    padded: 'lg',
  },
});

export type CardProps = GetProps<typeof Card>;
