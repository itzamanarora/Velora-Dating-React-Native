import { useState } from 'react';
import { YStack } from 'tamagui';
import { Body, Button, Caption, GradientButton, OtpInput } from '@/components/ui';
import { validateOtp } from '@/utils/validations';

export type OtpFormProps = {
  email: string;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  /** Extra helper under the title area inside the form */
  helperText?: string;
  submitLabel?: string;
};

/** Standalone 6-digit OTP form. */
export function OtpForm({
  email,
  onSubmit,
  onResend,
  isLoading = false,
  isResending = false,
  helperText = 'Enter the 6-digit code we sent to your email.',
  submitLabel = 'Verify OTP',
}: OtpFormProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | undefined>();

  const busy = isLoading || isResending;

  const handleSubmit = () => {
    const otpError = validateOtp(otp);
    if (otpError) {
      setError(otpError);
      return;
    }
    setError(undefined);
    onSubmit(otp.trim());
  };

  return (
    <YStack gap="$4" width="100%">
      <YStack gap="$1.5" alignItems="center">
        <Body color="#756A6D" textAlign="center" fontSize={14}>
          {helperText}
        </Body>
        {email ? (
          <Caption color="#E8446D" fontWeight="600" textAlign="center">
            {email}
          </Caption>
        ) : null}
      </YStack>

      <OtpInput
        value={otp}
        onChange={(text) => {
          setOtp(text);
          if (error) setError(undefined);
        }}
        disabled={busy}
        error={error}
        autoFocus
      />

      <Caption color="#9B8A8E" textAlign="center">
        Didn't get the code? Check spam, or resend below.
      </Caption>

      <YStack gap="$3">
        <GradientButton loading={isLoading} disabled={busy} onPress={handleSubmit}>
          {submitLabel}
        </GradientButton>

        <Button
          intent="ghost"
          fullWidth
          size="$4"
          loading={isResending}
          disabled={busy}
          onPress={onResend}
        >
          Resend OTP
        </Button>
      </YStack>
    </YStack>
  );
}
