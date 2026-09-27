import { SetupShell } from '@/components/setup/SetupShell';
import { Caption, GradientButton } from '@/components/ui';
import type { Gender } from '@/api/endpoints/profile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setGender } from '@/store/slices/profileSetupSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { Text, YStack } from 'tamagui';

const OPTIONS: { value: Gender; label: string; hint: string }[] = [
  { value: 'MALE', label: 'Male', hint: 'Identify as male' },
  { value: 'FEMALE', label: 'Female', hint: 'Identify as female' },
  { value: 'OTHER', label: 'Other', hint: 'Prefer to self-describe later' },
];

export default function SetupGenderScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.profileSetup);
  const [gender, setLocalGender] = useState<Gender | ''>(draft.gender);
  const [error, setError] = useState<string | undefined>();

  const handleContinue = () => {
    if (!gender) {
      setError('Please select a gender to continue');
      return;
    }
    setError(undefined);
    dispatch(setGender(gender));
    router.push('/setup/photo');
  };

  return (
    <SetupShell
      step={3}
      title="How do you identify?"
      subtitle="Pick the option that fits you best. You can update this later from settings."
    >
      <YStack gap="$3" f={1}>
        {OPTIONS.map((opt) => {
          const selected = gender === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                setLocalGender(opt.value);
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
