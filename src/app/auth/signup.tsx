import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { SignupForm } from '@/components/auth/SignupForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.signup', { email, password });

      Toast.show({
        type: 'success',
        text1: 'Check your email',
        text2: apiToastMessage(message || data.message || 'We sent a 6-digit verification code.'),
      });

      router.push({
        pathname: '/auth/otp',
        params: { email, purpose: 'signup' },
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title="Create your account"
      subtitle="Join Velora and start meeting people"
      footer={
        <Caption color="#756A6D">
          Already have an account?{' '}
          <Caption color="#E8446D" fontWeight="600" onPress={() => router.push('/auth/login')}>
            Sign in
          </Caption>
        </Caption>
      }
    >
      <SignupForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthScreenShell>
  );
}
