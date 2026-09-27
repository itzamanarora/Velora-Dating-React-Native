import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Caption, GradientButton, TextField } from '@/components/ui';
import { validateEmail, validatePassword } from '@/utils/validations';

export type SignupFormProps = {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
};

/** Signup step 1 — email + password only. OTP is a separate screen. */
export function SignupForm({ onSubmit, isLoading = false }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    onSubmit(email.trim(), password);
  };

  return (
    <YStack gap="$4" width="100%">
      <Caption color="#756A6D" textAlign="center">
        Use a real email — we'll send a 6-digit code to verify your account.
      </Caption>

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
        disabled={isLoading}
        error={errors.email}
        hint="We'll never share your email with anyone else."
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        placeholder="Create a password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        disabled={isLoading}
        error={errors.password}
        hint="At least 6 characters."
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#9B8A8E"
            />
          </TouchableOpacity>
        }
      />

      <GradientButton loading={isLoading} onPress={handleSubmit}>
        Continue
      </GradientButton>
    </YStack>
  );
}
