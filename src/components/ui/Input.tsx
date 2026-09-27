import { Input as TInput, styled, type GetProps } from 'tamagui';

export const Input = styled(TInput, {
  name: 'AppInput',
  backgroundColor: '#FFFFFF',
  borderWidth: 1.5,
  borderColor: '#E5E5E5',
  borderRadius: '$5',
  height: '$4.5',
  paddingHorizontal: '$3.5',
  fontSize: '$5',
  color: '#0F1824',
  placeholderTextColor: '$placeholderColor',
  focusStyle: {
    borderColor: '#E8446D',
    backgroundColor: '#FFFFFF',
    outlineWidth: 0,
  },
  hoverStyle: {
    borderColor: '#E8B4BE',
  },
  variants: {
    error: {
      true: {
        borderColor: '$danger',
        focusStyle: { borderColor: '$danger' },
      },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  } as const,
  defaultVariants: {
    fullWidth: true,
  },
});

export type InputProps = GetProps<typeof Input>;
