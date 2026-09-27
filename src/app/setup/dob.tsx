import { SetupShell } from '@/components/setup/SetupShell';
import { Caption, GradientButton, TextField } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDob } from '@/store/slices/profileSetupSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { XStack, YStack } from 'tamagui';

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function validateDob(year: string, month: string, day: string): string | null {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!year || !month || !day) return 'Please fill year, month, and day';
  if (!/^\d{4}$/.test(year) || y < 1920 || y > new Date().getFullYear()) {
    return 'Enter a valid year';
  }
  if (!/^\d{1,2}$/.test(month) || m < 1 || m > 12) return 'Enter a valid month (1–12)';
  if (!/^\d{1,2}$/.test(day) || d < 1 || d > daysInMonth(y, m)) {
    return 'Enter a valid day for that month';
  }

  const dob = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - y;
  const mDiff = today.getMonth() - (m - 1);
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) age -= 1;
  if (age < 18) return 'You must be at least 18 years old';
  if (Number.isNaN(dob.getTime())) return 'Invalid date of birth';

  return null;
}

export default function SetupDobScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.profileSetup);

  const [year, setYear] = useState(draft.year);
  const [month, setMonth] = useState(draft.month);
  const [day, setDay] = useState(draft.day);
  const [error, setError] = useState<string | undefined>();

  const handleContinue = () => {
    const err = validateDob(year, month, day);
    if (err) {
      setError(err);
      return;
    }
    setError(undefined);
    dispatch(setDob({ year: year.trim(), month: month.trim(), day: day.trim() }));
    router.push('/setup/gender');
  };

  return (
    <SetupShell
      step={2}
      title="When's your birthday?"
      subtitle="We use this to show your age on your profile. Your exact birthday stays private."
    >
      <YStack gap="$4" f={1}>
        <Caption color="#756A6D">
          Enter year, month, and day separately — example: 1998 · 06 · 15
        </Caption>

        <XStack gap="$3" alignItems="flex-start">
          <YStack f={1.2}>
            <TextField
              label="Year"
              value={year}
              onChangeText={(text) => {
                setYear(text.replace(/[^\d]/g, '').slice(0, 4));
                if (error) setError(undefined);
              }}
              placeholder="YYYY"
              keyboardType="number-pad"
              maxLength={4}
              returnKeyType="next"
            />
          </YStack>
          <YStack f={1}>
            <TextField
              label="Month"
              value={month}
              onChangeText={(text) => {
                setMonth(text.replace(/[^\d]/g, '').slice(0, 2));
                if (error) setError(undefined);
              }}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              returnKeyType="next"
            />
          </YStack>
          <YStack f={1}>
            <TextField
              label="Day"
              value={day}
              onChangeText={(text) => {
                setDay(text.replace(/[^\d]/g, '').slice(0, 2));
                if (error) setError(undefined);
              }}
              placeholder="DD"
              keyboardType="number-pad"
              maxLength={2}
              returnKeyType="go"
              onSubmitEditing={handleContinue}
            />
          </YStack>
        </XStack>

        {error ? (
          <Caption color="#DC3D4B">{error}</Caption>
        ) : (
          <Caption color="#9B8A8E">You must be 18+ to use Velora.</Caption>
        )}

        <YStack f={1} />

        <GradientButton onPress={handleContinue}>Continue</GradientButton>
      </YStack>
    </SetupShell>
  );
}
