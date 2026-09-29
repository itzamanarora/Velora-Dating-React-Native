import type { PreferredGender } from '@/api/endpoints/profile';
import { SetupShell } from '@/components/setup/SetupShell';
import { Caption, GradientButton } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPreferredGender } from '@/store/slices/profileSetupSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { Text, YStack } from 'tamagui';

const OPTIONS: { value: PreferredGender; label: string; hint: string }[] = [
  { value: 'MALE', label: 'Men', hint: 'I’m interested in dating men' },
  { value: 'FEMALE', label: 'Women', hint: 'I’m interested in dating women' },
  { value: 'OTHER', label: 'Everyone', hint: 'I’m open to dating everyone' },
];

export default function SetupPreferredGenderScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.profileSetup);
  const [preferredGender, setLocalPreferredGender] = useState<PreferredGender | ''>(draft.preferredGender);
  const [error, setError] = useState<string | undefined>();

  const handleContinue = () => {
    if (!preferredGender) {
      setError('Please select a gender to continue');
      return;
    }
    setError(undefined);
    dispatch(setPreferredGender(preferredGender));
    router.push('/setup/bio');
  };

  return (
    <SetupShell
      step={4}
      title="Who are you interested in?"
      subtitle="Choose who you'd like to meet and date."
    >
      <YStack gap="$3" f={1}>
        {OPTIONS.map((opt) => {
          const selected = preferredGender === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                setLocalPreferredGender(opt.value);
                if (error) setError(undefined);
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <YStack
                padding="$4"
                borderRadius={16}
                borderWidth={1.5}
                borderColor={selected ? '#E8446D' : '#E5E5E5'}
                backgroundColor={selected ? '#FFF5F7' : '#FFFFFF'}
                gap="$1"
              >
                <Text
                  fontSize={17}
                  fontWeight="700"
                  color={selected ? '#E8446D' : '#0F1824'}
                >
                  {opt.label}
                </Text>
                <Text fontSize={13} color="#756A6D">
                  {opt.hint}
                </Text>
              </YStack>
            </Pressable>
          );
        })}

        {error ? <Caption color="#DC3D4B">{error}</Caption> : null}

        <YStack f={1} />

        <GradientButton onPress={handleContinue}>Continue</GradientButton>
      </YStack>
    </SetupShell>
  );
}
