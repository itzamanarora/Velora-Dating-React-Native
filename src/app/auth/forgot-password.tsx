import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.forgotPassword', { email });

      Toast.show({
        type: 'success',
        text1: 'Check your email',
        text2: apiToastMessage(message || data.message),
      });

      setTimeout(() => {
        router.push({
          pathname: '/auth/reset-password',
          params: { email },
        });
      }, 700);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Request failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      variant="forgot"
      title="Forgot password?"
      subtitle="Enter your email and we'll send a reset code"
      footer={
        <Caption>
          Remember it?{' '}
          <Caption color="$primary" fontWeight="600" onPress={() => router.push('/auth/login')}>
            Back to sign in
          </Caption>
        </Caption>
      }
    >
      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthScreenShell>
  );
}
