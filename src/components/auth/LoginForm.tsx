import { useState } from 'react';
import { XStack, YStack } from 'tamagui';
import { Button, Caption, TextField } from '@/components/ui';
import { validateEmail, validatePassword } from '@/utils/validations';

export type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    onSubmit(email, password);
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
        error={errors.email}
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        error={errors.password}
      />

      <XStack justifyContent="flex-end" marginTop="$-2">
        <Caption color="$primary" fontWeight="500">
          Forgot password?
        </Caption>
      </XStack>

      <Button
        intent="primary"
        fullWidth
        size="$5"
        loading={isLoading}
        onPress={handleSubmit}
        marginTop="$2"
      >
        Sign in
      </Button>
    </YStack>
  );
}
