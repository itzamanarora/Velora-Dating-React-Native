import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Button, FadeInView, TextField } from '@/components/ui';
import { validateEmail, validateOtp, validatePassword } from '@/utils/validations';

export type SignupFormProps = {
  onVerify: (email: string, password: string) => Promise<boolean> | boolean;
  onConfirm: (email: string, otp: string) => void;
  onResend: (email: string) => void;
  isVerifying?: boolean;
  isConfirming?: boolean;
  isResending?: boolean;
};

export function SignupForm({
  onVerify,
  onConfirm,
  onResend,
  isVerifying = false,
  isConfirming = false,
  isResending = false,
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    otp?: string;
  }>({});

  const busy = isVerifying || isConfirming || isResending;

  const handleVerify = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    const ok = await onVerify(email, password);
    if (ok) {
      setOtpVisible(true);
      setOtp('');
    }
  };

  const handleConfirm = () => {
    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors((e) => ({ ...e, otp: otpError }));
      return;
    }
    setErrors((e) => ({ ...e, otp: undefined }));
    onConfirm(email, otp.trim());
  };

  return (
    <YStack gap="$4" width="100%">
      <TextField
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (otpVisible) setOtpVisible(false);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        disabled={busy}
        error={errors.email}
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (otpVisible) setOtpVisible(false);
          if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
        }}
        placeholder="Create a password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType={otpVisible ? 'next' : 'go'}
        onSubmitEditing={otpVisible ? undefined : handleVerify}
        disabled={busy}
        error={errors.password}
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="rgba(155,138,142,0.7)"
            />
          </TouchableOpacity>
        }
      />

      {otpVisible ? (
        <FadeInView delay={0} from="up" duration={420}>
          <TextField
            label="OTP"
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^\d]/g, '').slice(0, 8));
              if (errors.otp) setErrors((e) => ({ ...e, otp: undefined }));
            }}
            placeholder="Code sent to your email"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="go"
            onSubmitEditing={handleConfirm}
            maxLength={8}
            disabled={busy}
            error={errors.otp}
            hint="Enter the code we just sent you"
          />
        </FadeInView>
      ) : null}

      {!otpVisible ? (
        <Button
          intent="primary"
          fullWidth
          size="$5"
          loading={isVerifying}
          onPress={handleVerify}
          marginTop="$2"
        >
          Verify email
        </Button>
      ) : (
        <YStack gap="$3" marginTop="$2">
          <Button
            intent="primary"
            fullWidth
            size="$5"
            loading={isConfirming}
            onPress={handleConfirm}
          >
            Confirm & join
          </Button>
          <Button
            intent="ghost"
            fullWidth
            size="$4"
            disabled={busy}
            loading={isResending}
            onPress={() => onResend(email)}
          >
            Resend OTP
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
