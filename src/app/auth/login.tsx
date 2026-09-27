import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.login', { email, password });

      api.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      Toast.show({
        type: 'success',
        text1: 'Welcome back',
        text2: message?.trim() || 'You are signed in',
      });

      setTimeout(() => {
        router.replace('/welcome');
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof ApiError ? err.message : (err as any)?.message || '';
      const isEmailUnverified =
        typeof errorMsg === 'string' &&
        (errorMsg.toLowerCase().includes('verify your email') ||
          errorMsg.toLowerCase().includes('verify email'));

      if (isEmailUnverified) {
        Toast.show({
          type: 'info',
          text1: 'Email verification required',
          text2: apiToastMessage(errorMsg) || 'Please verify your email before logging in.',
        });
        router.push({
          pathname: '/auth/otp',
          params: { email, purpose: 'verify', autoResend: 'true' },
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: apiToastMessage(errorMsg),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      layout="split"
      title="Let's start with Log In"
      subtitle="Sign in to continue your Velora journey"
      footer={
        <Caption color="#756A6D">
          New here?{' '}
          <Caption color="#E8446D" fontWeight="600" onPress={() => router.push('/auth/signup')}>
            Create an account
          </Caption>
        </Caption>
      }
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        onForgotPassword={() => router.push('/auth/forgot-password')}
      />
    </AuthScreenShell>
  );
}
