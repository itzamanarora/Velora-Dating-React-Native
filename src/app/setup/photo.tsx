import { api, ApiError, apiToastMessage } from '@/api';
import { SetupShell } from '@/components/setup/SetupShell';
import { Caption, GradientButton } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  buildDateOfBirth,
  resetProfileSetup,
  setPhoto,
} from '@/store/slices/profileSetupSlice';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { Text, YStack } from 'tamagui';

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  return 'image/jpeg';
}

export default function SetupPhotoScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.profileSetup);

  const [uri, setUri] = useState(draft.profilePictureUri);
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  const pickImage = async () => {
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Photo access is needed to set your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.55,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const selected = result.assets[0].uri;
      setUri(selected);
      setError(undefined);
      dispatch(setPhoto({ uri: selected, url: selected }));
    } catch {
      setError('Could not open your photo library. Please try again.');
    } finally {
      setIsPicking(false);
    }
  };

  const resolvePictureUrl = async (localUri: string): Promise<string> => {
    if (/^https?:\/\//i.test(localUri)) return localUri;

    try {
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:${mimeFromUri(localUri)};base64,${base64}`;
    } catch {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${draft.firstName}+${draft.lastName}`,
      )}&background=E8446D&color=fff&size=256`;
    }
  };

  const handleFinish = async () => {
    if (!uri) {
      setError('Please upload a profile picture to continue');
      return;
    }

    if (!draft.firstName || !draft.lastName || !draft.gender || !draft.year) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete profile',
        text2: 'Please go back and complete all previous steps.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const profilePictureUrl = await resolvePictureUrl(uri);

      const { message } = await api.call('profile.createMe', {
        firstName: draft.firstName,
        lastName: draft.lastName,
        dateOfBirth: buildDateOfBirth(draft),
        gender: draft.gender,
        profilePictureUrl,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile ready',
        text2: apiToastMessage(message || 'Welcome to Velora — start exploring.'),
      });

      dispatch(resetProfileSetup());
      router.replace('/home');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not save profile',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleSignOut = async () => {
      try {
        const refreshToken = api.getRefreshToken();
        if (refreshToken) {
          await api.call('auth.logout', { refreshToken });
        }
      } catch {
        // still clear local session
      } finally {
        api.clearTokens();
        router.replace('/get-started');
      }
    };

  return (
    <SetupShell
      step={4}
      title="Add a profile photo"
      subtitle="A clear face photo gets better matches. Pick your best shot — you can change it later."
    >
      <YStack gap="$4" f={1} alignItems="center">
        <Pressable
          onPress={pickImage}
          disabled={isPicking || isSubmitting}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <YStack
            width={180}
            height={180}
            borderRadius={90}
            backgroundColor="#FFF5F7"
            borderWidth={2}
            borderColor={uri ? '#E8446D' : '#FFCCD5'}
            borderStyle={uri ? 'solid' : 'dashed'}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            {isPicking ? (
              <ActivityIndicator color="#E8446D" />
            ) : uri ? (
              <Image
                source={{ uri }}
                style={{ width: 180, height: 180 }}
                contentFit="cover"
              />
            ) : (
              <YStack alignItems="center" gap="$2" padding="$4">
                <Text fontSize={28} color="#E8446D" fontWeight="700">
                  +
                </Text>
                <Text color="#E8446D" fontWeight="600" fontSize={14} textAlign="center">
                  Tap to upload
                </Text>
              </YStack>
            )}
          </YStack>
        </Pressable>

        <Caption color="#756A6D" textAlign="center">
          {uri
            ? 'Looking good — tap the photo again to change it.'
            : 'JPG or PNG from your gallery works best.'}
        </Caption>

        {error ? <Caption color="#DC3D4B">{error}</Caption> : null}

        <YStack f={1} />

        <YStack width="100%" gap="$3">
          {!uri ? (
            <GradientButton onPress={pickImage} disabled={isPicking}>
              Choose photo
            </GradientButton>
          ) : (
            <GradientButton onPress={handleFinish} loading={isSubmitting}>
              Finish & start exploring
            </GradientButton>
          )}
        </YStack>
      </YStack>
        <Pressable onPress={handleSignOut} hitSlop={10}>
            <Text color="#E8446D" fontWeight="600" fontSize={14}>
              Sign out
            </Text>
          </Pressable>
    </SetupShell>
  );
}
