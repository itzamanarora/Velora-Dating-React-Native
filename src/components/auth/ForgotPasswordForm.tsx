import { useState } from 'react';
import { YStack } from 'tamagui';
import { Caption, GradientButton, TextField } from '@/components/ui';
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
      <Caption color="#756A6D" textAlign="center">
        Enter the email linked to your Velora account. We'll send a 6-digit reset code next.
      </Caption>

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
        hint="Make sure you can access this inbox."
      />

      <GradientButton loading={isLoading} onPress={handleSubmit}>
        Send reset code
      </GradientButton>
    </YStack>
  );
}
