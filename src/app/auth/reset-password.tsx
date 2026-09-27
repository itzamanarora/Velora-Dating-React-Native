import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — forwards to OTP (then new-password) flow. */
export default function ResetPasswordRedirect() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';

  if (!email) {
    return <Redirect href="/auth/forgot-password" />;
  }

  return (
    <Redirect
      href={{
        pathname: '/auth/otp',
        params: { email, purpose: 'reset' },
      }}
    />
  );
}
