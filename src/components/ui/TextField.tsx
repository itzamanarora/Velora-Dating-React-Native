import { Label, YStack } from 'tamagui';
import type { ReactNode } from 'react';
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
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <YStack gap="$1.5" width="100%">
      {label ? (
        <Label htmlFor={fieldId} fontSize="$4" fontWeight="500" color="$color" opacity={0.85}>
          {label}
        </Label>
      ) : null}

      <Input
        id={fieldId}
        error={!!error}
        aria-invalid={!!error}
        {...inputProps}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}
      {!error && hint ? <Caption>{hint}</Caption> : null}
    </YStack>
  );
}
