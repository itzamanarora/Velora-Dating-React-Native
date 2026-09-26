import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  const handleSubmit = async (email: string, otp: string, newPassword: string) => {
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
        text2: apiToastMessage(message || data.message),
      });

      setTimeout(() => {
        router.replace('/auth/login');
      }, 900);
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

  const handleResend = async (email: string) => {
    setIsResending(true);
    try {
      // Re-trigger forgot flow to send a fresh OTP
      const { data, message } = await api.call('auth.forgotPassword', { email });

      Toast.show({
        type: 'success',
        text1: 'OTP resent',
        text2: apiToastMessage(message || data.message),
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Resend failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthScreenShell
      variant="reset"
      title="Reset password"
      subtitle="Enter the OTP and choose a new password"
      footer={
        <Caption>
          Back to{' '}
          <Caption color="$primary" fontWeight="600" onPress={() => router.push('/auth/login')}>
            Sign in
          </Caption>
        </Caption>
      }
    >
      <ResetPasswordForm
        initialEmail={initialEmail}
        onSubmit={handleSubmit}
        onResend={handleResend}
        isLoading={isLoading}
        isResending={isResending}
      />
    </AuthScreenShell>
  );
}
