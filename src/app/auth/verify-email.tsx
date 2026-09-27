import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — forwards to the shared OTP screen. */
export default function VerifyEmailRedirect() {
  const params = useLocalSearchParams<{ email?: string; autoResend?: string }>();
  return (
    <Redirect
      href={{
        pathname: '/auth/otp',
        params: {
          email: typeof params.email === 'string' ? params.email : '',
          purpose: 'verify',
          autoResend: params.autoResend === 'true' ? 'true' : 'false',
        },
      }}
    />
  );
}
