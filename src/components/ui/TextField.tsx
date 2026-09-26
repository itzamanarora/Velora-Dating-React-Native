import { useId, type ReactNode } from 'react';
import { Label, XStack, YStack } from 'tamagui';
import { Input, type InputProps } from './Input';
import { Caption, ErrorText } from './Text';

export type TextFieldProps = Omit<InputProps, 'error'> & {
  label?: string;
  error?: string | null;
  hint?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  id,
  leftElement,
  rightElement,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? (label ? `${label.toLowerCase().replace(/\s+/g, '-')}-${generatedId}` : undefined);

  return (
    <YStack gap="$1.5" width="100%">
      {label ? (
        <Label htmlFor={fieldId} fontSize="$4" fontWeight="500" color="$color" opacity={0.85}>
          {label}
        </Label>
      ) : null}

      <XStack alignItems="center" position="relative" width="100%" pointerEvents="box-none">
        {leftElement ? (
          <XStack position="absolute" left={12} zIndex={10} alignItems="center" justifyContent="center">
            {leftElement}
          </XStack>
        ) : null}

        <Input
          id={fieldId}
          error={!!error}
          aria-invalid={!!error}
          paddingLeft={leftElement ? (inputProps.paddingLeft ?? 40) : inputProps.paddingLeft}
          paddingRight={rightElement ? (inputProps.paddingRight ?? 44) : inputProps.paddingRight}
          {...inputProps}
        />

        {rightElement ? (
          <XStack position="absolute" right={12} zIndex={10} alignItems="center" justifyContent="center">
            {rightElement}
          </XStack>
        ) : null}
      </XStack>

      {error ? <ErrorText>{error}</ErrorText> : null}
      {!error && hint ? <Caption>{hint}</Caption> : null}
    </YStack>
  );
}

