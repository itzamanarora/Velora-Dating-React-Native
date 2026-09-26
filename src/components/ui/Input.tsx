import { Input as TInput, styled, type GetProps } from 'tamagui';

export const Input = styled(TInput, {
  name: 'AppInput',
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  borderWidth: 1.5,
  borderColor: '$borderColor',
  borderRadius: '$5',
  height: '$4.5',
  paddingHorizontal: '$3.5',
  fontSize: '$5',
  color: '$color',
  placeholderTextColor: '$placeholderColor',
  focusStyle: {
    borderColor: '$borderColorFocus',
    backgroundColor: '#FFFBFC',
    outlineWidth: 0,
  },
  hoverStyle: {
    borderColor: '$borderColorHover',
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
