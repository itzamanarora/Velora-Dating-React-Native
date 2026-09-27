import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Caption, GradientButton, TextField } from '@/components/ui';
import { validatePassword } from '@/utils/validations';

export type NewPasswordFormProps = {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
};

/** Standalone new-password step (after OTP). */
export function NewPasswordForm({ onSubmit, isLoading = false }: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = () => {
    const passwordError = validatePassword(password);
    const confirmError =
      !confirm
        ? 'Please confirm your password'
        : password !== confirm
          ? 'Passwords do not match'
          : null;

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError || undefined,
        confirm: confirmError || undefined,
      });
      return;
    }

    setErrors({});
    onSubmit(password);
  };

  return (
    <YStack gap="$4" width="100%">
      <Caption color="#756A6D" textAlign="center">
        Choose a strong password you haven't used here before. You'll use it to sign in next time.
      </Caption>

      <TextField
        label="New password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        placeholder="Enter new password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
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

      <TextField
        label="Confirm password"
        value={confirm}
        onChangeText={(text) => {
          setConfirm(text);
          if (errors.confirm) setErrors((e) => ({ ...e, confirm: undefined }));
        }}
        placeholder="Re-enter new password"
        secureTextEntry={!showConfirm}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        disabled={isLoading}
        error={errors.confirm}
        rightElement={
          <TouchableOpacity
            onPress={() => setShowConfirm((v) => !v)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#9B8A8E"
            />
          </TouchableOpacity>
        }
      />

      <GradientButton loading={isLoading} onPress={handleSubmit}>
        Save new password
      </GradientButton>
    </YStack>
  );
}
