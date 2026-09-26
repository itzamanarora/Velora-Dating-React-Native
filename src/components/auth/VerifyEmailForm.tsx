import { useState } from 'react';
import { YStack } from 'tamagui';
import { Button, TextField } from '@/components/ui';
import { validateEmail, validateOtp } from '@/utils/validations';

export type VerifyEmailFormProps = {
  initialEmail?: string;
  onVerifyOtp: (email: string, otp: string) => void;
  onResendOtp: (email: string) => void;
  isLoading?: boolean;
  isResending?: boolean;
};

export function VerifyEmailForm({
  initialEmail = '',
  onVerifyOtp,
  onResendOtp,
  isLoading = false,
  isResending = false,
}: VerifyEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});

  const busy = isLoading || isResending;

  const handleVerify = () => {
    const emailError = validateEmail(email);
    const otpError = validateOtp(otp);

    if (emailError || otpError) {
      setErrors({
        email: emailError || undefined,
        otp: otpError || undefined,
      });
      return;
    }

    setErrors({});
    onVerifyOtp(email.trim(), otp.trim());
  };

  const handleResend = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((e) => ({ ...e, email: emailError }));
      return;
    }
    setErrors((e) => ({ ...e, email: undefined }));
    onResendOtp(email.trim());
  };

  return (
    <YStack gap="$4" width="100%">
      <TextField
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        disabled={busy}
        error={errors.email}
      />

      <TextField
        label="OTP Code"
        value={otp}
        onChangeText={(text) => {
          setOtp(text.replace(/[^\d]/g, '').slice(0, 8));
          if (errors.otp) setErrors((e) => ({ ...e, otp: undefined }));
        }}
        placeholder="Enter OTP sent to your email"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        returnKeyType="go"
        maxLength={8}
        disabled={busy}
        error={errors.otp}
        hint="Check your inbox or spam folder for the code"
      />

      <YStack gap="$3" marginTop="$2">
        <Button
          intent="primary"
          fullWidth
          size="$5"
          loading={isLoading}
          disabled={busy}
          onPress={handleVerify}
        >
          Verify OTP
        </Button>

        <Button
          intent="ghost"
          fullWidth
          size="$4"
          loading={isResending}
          disabled={busy}
          onPress={handleResend}
        >
          Resend OTP
        </Button>
      </YStack>
    </YStack>
  );
}
