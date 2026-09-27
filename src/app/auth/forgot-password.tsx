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
        text2: apiToastMessage(message || data.message || 'We sent a 6-digit reset code.'),
      });

      router.push({
        pathname: '/auth/otp',
        params: { email, purpose: 'reset' },
      });
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
      title="Forgot password?"
      subtitle="No worries — it happens to everyone"
      footer={
        <Caption color="#756A6D">
          Remember it?{' '}
          <Caption color="#E8446D" fontWeight="600" onPress={() => router.push('/auth/login')}>
            Back to sign in
          </Caption>
        </Caption>
      }
    >
      <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthScreenShell>
  );
}
