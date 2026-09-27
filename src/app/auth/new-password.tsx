import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function NewPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const otp = typeof params.otp === 'string' ? params.otp : '';

  if (!email || !otp) {
    return <Redirect href="/auth/forgot-password" />;
  }

  const handleSubmit = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.resetPassword', {
        email,
        otp,
        newPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Password updated',
        text2: apiToastMessage(message || data.message || 'You can sign in with your new password.'),
      });

      setTimeout(() => {
        router.replace('/auth/login');
      }, 500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Reset failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title="Create new password"
      subtitle="You're one step away from getting back in"
      footer={
        <Caption color="#756A6D">
          Remembered it?{' '}
          <Caption color="#E8446D" fontWeight="600" onPress={() => router.replace('/auth/login')}>
            Back to sign in
          </Caption>
        </Caption>
      }
    >
      <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthScreenShell>
  );
}
