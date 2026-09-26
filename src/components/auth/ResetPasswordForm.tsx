import { useState } from 'react';
import { YStack } from 'tamagui';
import { Button, TextField } from '@/components/ui';
import { validateEmail, validateOtp, validatePassword } from '@/utils/validations';

export type ResetPasswordFormProps = {
  onSubmit: (email: string, otp: string, newPassword: string) => void;
  onResend?: (email: string) => void;
  isLoading?: boolean;
  isResending?: boolean;
  initialEmail?: string;
};

export function ResetPasswordForm({
  onSubmit,
  onResend,
  isLoading = false,
  isResending = false,
  initialEmail = '',
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
  }>({});

  const busy = isLoading || isResending;

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    const otpError = validateOtp(otp);
    const passwordError = validatePassword(newPassword);

    if (emailError || otpError || passwordError) {
      setErrors({
        email: emailError || undefined,
        otp: otpError || undefined,
        newPassword: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    onSubmit(email.trim(), otp.trim(), newPassword);
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
        label="OTP"
        value={otp}
        onChangeText={(text) => {
          setOtp(text.replace(/[^\d]/g, '').slice(0, 8));
          if (errors.otp) setErrors((e) => ({ ...e, otp: undefined }));
        }}
        placeholder="Code from your email"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        returnKeyType="next"
        maxLength={8}
        disabled={busy}
        error={errors.otp}
      />

      <TextField
        label="New password"
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          if (errors.newPassword) setErrors((e) => ({ ...e, newPassword: undefined }));
        }}
        placeholder="Choose a new password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        disabled={busy}
        error={errors.newPassword}
      />

      <Button
        intent="primary"
        fullWidth
        size="$5"
        loading={isLoading}
        onPress={handleSubmit}
        marginTop="$2"
      >
        Reset password
      </Button>

      {onResend ? (
        <Button
          intent="ghost"
          fullWidth
          size="$4"
          disabled={busy}
          loading={isResending}
          onPress={() => {
            const emailError = validateEmail(email);
            if (emailError) {
              setErrors((e) => ({ ...e, email: emailError }));
              return;
            }
            onResend(email.trim());
          }}
        >
          Resend OTP
        </Button>
      ) : null}
    </YStack>
  );
}
