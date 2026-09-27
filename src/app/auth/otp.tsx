import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { OtpForm } from '@/components/auth/OtpForm';
import { Caption } from '@/components/ui';
import { api, ApiError, apiToastMessage } from '@/api';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

type OtpPurpose = 'signup' | 'verify' | 'reset';

function parsePurpose(value: string | undefined): OtpPurpose | null {
  if (value === 'signup' || value === 'verify' || value === 'reset') return value;
  return null;
}

const COPY: Record<
  OtpPurpose,
  { title: string; subtitle: string; helper: string; submit: string }
> = {
  signup: {
    title: 'Verify your email',
    subtitle: "Almost there — confirm it's really you",
    helper: 'We sent a 6-digit code to verify your new Velora account.',
    submit: 'Verify & continue',
  },
  verify: {
    title: 'Verify your email',
    subtitle: 'Your account needs a quick confirmation',
    helper: 'Enter the 6-digit code we just sent so you can sign in.',
    submit: 'Verify email',
  },
  reset: {
    title: 'Enter reset code',
    subtitle: 'Check your inbox for the 6-digit OTP',
    helper: 'Use the code we sent to continue resetting your password.',
    submit: 'Continue',
  },
};

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    purpose?: string;
    autoResend?: string;
  }>();

  const email = typeof params.email === 'string' ? params.email : '';
  const purpose = parsePurpose(typeof params.purpose === 'string' ? params.purpose : undefined);
  const autoResend = params.autoResend === 'true';

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const hasAutoSentRef = useRef(false);

  const handleResend = useCallback(async () => {
    if (!email) return;
    setIsResending(true);
    try {
      if (purpose === 'reset') {
        const { data, message } = await api.call('auth.forgotPassword', { email });
        Toast.show({
          type: 'success',
          text1: 'Code resent',
          text2: apiToastMessage(message || data.message),
        });
      } else {
        const { data, message } = await api.call('auth.resendOtp', { email });
        Toast.show({
          type: 'success',
          text1: 'OTP resent',
          text2: apiToastMessage(message || data.message),
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Resend failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsResending(false);
    }
  }, [email, purpose]);

  useEffect(() => {
    if (autoResend && email && purpose && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      handleResend();
    }
  }, [autoResend, email, purpose, handleResend]);

  if (!purpose || !email) {
    return <Redirect href="/auth/login" />;
  }

  const copy = COPY[purpose];

  const handleSubmit = async (otp: string) => {
    if (purpose === 'reset') {
      router.push({
        pathname: '/auth/new-password',
        params: { email, otp },
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, message } = await api.call('auth.verifyOtp', { email, otp });

      Toast.show({
        type: 'success',
        text1: purpose === 'signup' ? 'Account verified' : 'Email verified',
        text2: apiToastMessage(
          message || data.message || 'You can sign in with your email and password now.',
        ),
      });

      setTimeout(() => {
        router.replace('/auth/login');
      }, 500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'OTP failed',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        <Caption color="#756A6D">
          Wrong email?{' '}
          <Caption
            color="#E8446D"
            fontWeight="600"
            onPress={() =>
              router.replace(
                purpose === 'signup'
                  ? '/auth/signup'
                  : purpose === 'reset'
                    ? '/auth/forgot-password'
                    : '/auth/login',
              )
            }
          >
            Go back
          </Caption>
        </Caption>
      }
    >
      <OtpForm
        email={email}
        helperText={copy.helper}
        submitLabel={copy.submit}
        onSubmit={handleSubmit}
        onResend={handleResend}
        isLoading={isLoading}
        isResending={isResending}
      />
    </AuthScreenShell>
  );
}
