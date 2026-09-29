import { SetupShell } from '@/components/setup/SetupShell';
import { Caption, GradientButton } from '@/components/ui';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBio } from '@/store/slices/profileSetupSlice';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextArea, YStack } from 'tamagui';

const MAX_BIO_LENGTH = 500;

export default function SetupBioScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const draft = useAppSelector((s) => s.profileSetup);

  const [bio, setLocalBio] = useState(draft.bio);
  const [error, setError] = useState<string | undefined>();

  const handleContinue = () => {
    const trimmedBio = bio.trim();

    setError(undefined);

    dispatch(setBio(trimmedBio));

    router.push('/setup/photo');
  };

  return (
    <SetupShell
      step={5}
      title="Tell us about you"
      subtitle="Write a short bio so people can get to know you."
    >
      <YStack gap="$3" f={1}>
        <YStack gap="$2">
          <TextArea
            value={bio}
            onChangeText={(text) => {
              if (text.length <= MAX_BIO_LENGTH) {
                setLocalBio(text);

                if (error) {
                  setError(undefined);
                }
              }
            }}
            placeholder="Tell people a little about yourself...(Optional)"
            multiline
            numberOfLines={7}
            textAlignVertical="top"
            fontSize={16}
            color="#0F1824"
            backgroundColor="#FFFFFF"
            borderWidth={1.5}
            borderColor={error ? '#DC3D4B' : '#E5E5E5'}
            borderRadius={16}
            padding="$4"
            minHeight={160}
            focusStyle={{
              borderColor: '#E8446D',
            }}
          />

          <Text
            alignSelf="flex-end"
            fontSize={12}
            color="#8A8083"
          >
            {bio.length}/{MAX_BIO_LENGTH}
          </Text>
        </YStack>

        {error ? (
          <Caption color="#DC3D4B">
            {error}
          </Caption>
        ) : null}

        <YStack f={1} />

        <GradientButton onPress={handleContinue}>
          Continue
        </GradientButton>
      </YStack>
    </SetupShell>
  );
}