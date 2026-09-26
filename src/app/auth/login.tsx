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
        router.replace('/');
      }, 800);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      variant="login"
      title="Welcome back"
      subtitle="Sign in and pick up your conversations"
      footer={
        <Caption>
          New here?{' '}
          <Caption color="$primary" fontWeight="600" onPress={() => router.push('/auth/signup')}>
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
