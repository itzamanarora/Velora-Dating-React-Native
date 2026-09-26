import { Circle, styled, type GetProps } from 'tamagui';

/** Brand mark / logo placeholder — swap for Image later. */
export const BrandMark = styled(Circle, {
  name: 'BrandMark',
  size: 64,
  backgroundColor: '$primary',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '$primary',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevationAndroid: 6,
  variants: {
    sizeVariant: {
      sm: { size: 48 },
      md: { size: 64 },
      lg: { size: 80 },
    },
  } as const,
  defaultVariants: {
    sizeVariant: 'md',
  },
});

export type BrandMarkProps = GetProps<typeof BrandMark>;
