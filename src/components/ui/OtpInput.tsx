import { useRef } from 'react';
import { TextInput, type TextInputKeyPressEvent, type TextInput as TextInputType } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

const OTP_LENGTH = 6;

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
};

/** Six single-digit OTP boxes. */
export function OtpInput({
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const refs = useRef<(TextInputType | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');

  const setDigit = (index: number, char: string) => {
    const cleaned = char.replace(/[^\d]/g, '');
    if (!cleaned && char !== '') return;

    const next = digits.slice();
    if (cleaned.length > 1) {
      // Paste support — fill remaining boxes
      const chars = cleaned.slice(0, OTP_LENGTH - index).split('');
      chars.forEach((c, offset) => {
        next[index + offset] = c;
      });
      onChange(next.join('').slice(0, OTP_LENGTH));
      const focusAt = Math.min(index + chars.length, OTP_LENGTH - 1);
      refs.current[focusAt]?.focus();
      return;
    }

    next[index] = cleaned;
    onChange(next.join(''));

    if (cleaned && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, e: TextInputKeyPressEvent) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      const next = digits.slice();
      next[index - 1] = '';
      onChange(next.join(''));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <YStack gap="$1.5" width="100%">
      <XStack justifyContent="space-between" gap="$2" width="100%">
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            value={digit}
            onChangeText={(text) => setDigit(index, text)}
            onKeyPress={(e) => onKeyPress(index, e)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={index === 0 ? OTP_LENGTH : 1}
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            selectTextOnFocus
            style={{
              flex: 1,
              height: 52,
              borderWidth: 1.5,
              borderColor: error ? '#DC3D4B' : digit ? '#E8446D' : '#E5E5E5',
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
              color: '#0F1824',
            }}
          />
        ))}
      </XStack>
      {error ? (
        <Text color="#DC3D4B" fontSize={13}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}

export const OTP_CODE_LENGTH = OTP_LENGTH;
