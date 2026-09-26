import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function VerifyEmailScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; autoResend?: string }>();
  const initialEmail = typeof params.email === 'string' ? params.email : '';
  const autoResend = params.autoResend === 'true';
  const hasAutoSentRef = useRef(false);

  useEffect(() => {
    if (autoResend && initialEmail && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      handleResendOtp(initialEmail);
    }
  }, [autoResend, initialEmail]);

  const handleVerifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.verifyOtp', {
        email,
        otp,
      });

      Toast.show({
        type: 'success',
        text1: 'Email Verified',
        text2: apiToastMessage(message || data?.message || 'Email verified successfully. Please log in.'),
      });

      setTimeout(() => {
        router.replace('/auth/login');
      }, 900);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (email: string) => {
    setIsResending(true);
    try {
      const { data, message } = await api.call('auth.resendOtp', { email });

      Toast.show({
        type: 'success',
        text1: 'OTP Resent',
        text2: apiToastMessage(message || data?.message || 'Verification code sent to your email'),
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
      variant="verify"
      title="Verify Email"
      subtitle="Please enter the verification code sent to your email"
      footer={
        <Caption>
          Back to{' '}
          <Caption color="$primary" fontWeight="600" onPress={() => router.push('/auth/login')}>
            Sign in
          </Caption>
        </Caption>
      }
    >
      <VerifyEmailForm
        initialEmail={initialEmail}
        onVerifyOtp={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isLoading={isLoading}
        isResending={isResending}
      />
    </AuthScreenShell>
  );
}
