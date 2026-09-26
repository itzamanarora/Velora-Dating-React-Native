import { Button as TButton, Spinner, styled, type GetProps } from 'tamagui';
import type { ReactNode } from 'react';

const StyledButton = styled(TButton, {
  name: 'AppButton',
  borderRadius: '$6',
  height: '$4.5',
  fontWeight: '600',
  pressStyle: {
    scale: 0.98,
    opacity: 0.92,
  },
  variants: {
    intent: {
      primary: {
        backgroundColor: '$primary',
        color: '$primaryText',
        borderWidth: 0,
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '$primaryPress', scale: 0.98 },
      },
      secondary: {
        backgroundColor: '$secondary',
        color: '$secondaryText',
        borderWidth: 0,
        hoverStyle: { backgroundColor: '$secondaryHover' },
        pressStyle: { backgroundColor: '$secondaryPress', scale: 0.98 },
      },
      outline: {
        backgroundColor: 'transparent',
        color: '$primary',
        borderWidth: 1.5,
        borderColor: '$primary',
        hoverStyle: { backgroundColor: '$mutedBackground' },
        pressStyle: { backgroundColor: '$mutedBackground', scale: 0.98 },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$primary',
        borderWidth: 0,
        hoverStyle: { backgroundColor: '$mutedBackground' },
        pressStyle: { backgroundColor: '$secondary', scale: 0.98 },
      },
      danger: {
        backgroundColor: '$danger',
        color: '$primaryText',
        borderWidth: 0,
        pressStyle: { opacity: 0.85, scale: 0.98 },
      },
    },
    fullWidth: {
      true: { alignSelf: 'stretch', width: '100%' },
    },
  } as const,
  defaultVariants: {
    intent: 'primary',
  },
});

type StyledButtonProps = GetProps<typeof StyledButton>;

export type ButtonProps = StyledButtonProps & {
  loading?: boolean;
  children?: ReactNode;
};

export function Button({
  loading = false,
  disabled,
  children,
  intent = 'primary',
  icon,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      intent={intent}
      disabled={isDisabled}
      opacity={isDisabled ? 0.55 : 1}
      icon={loading ? undefined : icon}
      {...props}
    >
      {loading ? <Spinner size="small" color="white" /> : children}
    </StyledButton>
  );
}
