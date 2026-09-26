import { useState } from 'react';
import { YStack } from 'tamagui';
import { Button, TextField } from '@/components/ui';
import { validateEmail } from '@/utils/validations';

export type ForgotPasswordFormProps = {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  initialEmail?: string;
};

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  initialEmail = '',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    setError(undefined);
    onSubmit(email.trim());
  };

  return (
    <YStack gap="$4" width="100%">
      <TextField
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(undefined);
        }}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        error={error}
        hint="We'll send a one-time code to this email"
      />

      <Button
        intent="primary"
        fullWidth
        size="$5"
        loading={isLoading}
        onPress={handleSubmit}
        marginTop="$2"
      >
        Send OTP
      </Button>
    </YStack>
  );
}
