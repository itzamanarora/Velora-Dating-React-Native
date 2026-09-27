import { SetupShell } from '@/components/setup/SetupShell';
import { GradientButton, TextField } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setName } from '@/store/slices/profileSetupSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { YStack } from 'tamagui';

function validateName(value: string, label: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters`;
  return null;
}

export default function SetupNameScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.profileSetup);

  const [firstName, setFirstName] = useState(draft.firstName);
  const [lastName, setLastName] = useState(draft.lastName);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  const handleContinue = () => {
    const firstError = validateName(firstName, 'First name');
    const lastError = validateName(lastName, 'Last name');
    if (firstError || lastError) {
      setErrors({
        firstName: firstError || undefined,
        lastName: lastError || undefined,
      });
      return;
    }

    dispatch(
      setName({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    );
    router.push('/setup/dob');
  };

  return (
    <SetupShell
      step={1}
      showBack={false}
      title="What's your name?"
      subtitle="This is how you'll appear on Velora. Use your real name so matches know it's you."
    >
      <YStack gap="$4" f={1}>
        <TextField
          label="First name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (errors.firstName) setErrors((e) => ({ ...e, firstName: undefined }));
          }}
          placeholder="e.g. Aman"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          error={errors.firstName}
        />

        <TextField
          label="Last name"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (errors.lastName) setErrors((e) => ({ ...e, lastName: undefined }));
          }}
          placeholder="e.g. Arora"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          returnKeyType="go"
          onSubmitEditing={handleContinue}
          error={errors.lastName}
        />

        <YStack f={1} />

        <GradientButton onPress={handleContinue}>Continue</GradientButton>
      </YStack>
    </SetupShell>
  );
}
