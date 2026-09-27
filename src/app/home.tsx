import { api, ApiError, apiToastMessage } from '@/api';
import type { UserProfile } from '@/api/endpoints/profile';
import {
  Body,
  Caption,
  FadeInView,
  GradientButton,
  Heading,
  Screen,
} from '@/components/ui';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Text, XStack, YStack } from 'tamagui';

function ageFromDob(dob: string): string | null {
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const m = today.getMonth() - parsed.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < parsed.getDate())) age -= 1;
  return String(age);
}

function genderLabel(gender: string): string {
  const g = gender?.toUpperCase();
  if (g === 'MALE') return 'Male';
  if (g === 'FEMALE') return 'Female';
  if (g === 'OTHER') return 'Other';
  return gender || '—';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data } = await api.call('profile.list');
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.content)
          ? (data as any).content
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
      setProfiles(list);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not load profiles',
        text2: apiToastMessage(err instanceof ApiError ? err.message : undefined),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfiles();
    }, [loadProfiles]),
  );

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
    <Screen backgroundColor="#FFFFFF" paddingHorizontal={0}>
      <YStack f={1} paddingTop={insets.top + 8}>
        <XStack
          paddingHorizontal="$5"
          paddingBottom="$3"
          alignItems="center"
          justifyContent="space-between"
        >
          <YStack gap="$1">
            <Heading level={2} color="#0F1824" fontSize={26} fontWeight="800">
              Discover
            </Heading>
            <Caption color="#756A6D">People near you on Velora</Caption>
          </YStack>
          <Pressable onPress={handleSignOut} hitSlop={10}>
            <Text color="#E8446D" fontWeight="600" fontSize={14}>
              Sign out
            </Text>
          </Pressable>
        </XStack>

        {loading ? (
          <YStack f={1} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color="#E8446D" />
            <Caption color="#756A6D" marginTop="$3">
              Loading profiles…
            </Caption>
          </YStack>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: Math.max(insets.bottom, 24) + 16,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadProfiles(true)}
                tintColor="#E8446D"
                colors={['#E8446D']}
              />
            }
            ListEmptyComponent={
              <YStack f={1} alignItems="center" justifyContent="center" paddingVertical="$10" gap="$3">
                <Text fontSize={40}>💫</Text>
                <Heading level={3} color="#0F1824" textAlign="center">
                  No profiles yet
                </Heading>
                <Body color="#756A6D" textAlign="center" paddingHorizontal="$4">
                  Pull to refresh — new people will show up here as they join Velora.
                </Body>
                <GradientButton
                  style={{ marginTop: 12, maxWidth: 220 }}
                  onPress={() => loadProfiles(true)}
                >
                  Refresh
                </GradientButton>
              </YStack>
            }
            ItemSeparatorComponent={() => <YStack height={14} />}
            renderItem={({ item, index }) => {
              const age = ageFromDob(item.dateOfBirth);
              return (
                <FadeInView delay={Math.min(index * 30, 150)} from="none">
                  <XStack
                    backgroundColor="#FFF5F7"
                    borderRadius={20}
                    borderWidth={1}
                    borderColor="#FFCCD5"
                    padding="$3"
                    gap="$3"
                    alignItems="center"
                  >
                    <Image
                      source={{
                        uri:
                          item.profilePictureUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            `${item.firstName}+${item.lastName}`,
                          )}&background=E8446D&color=fff&size=128`,
                      }}
                      style={{ width: 72, height: 72, borderRadius: 36 }}
                      contentFit="cover"
                    />
                    <YStack f={1} gap="$1">
                      <Text color="#0F1824" fontSize={17} fontWeight="700">
                        {item.firstName} {item.lastName}
                        {age ? `, ${age}` : ''}
                      </Text>
                      <Caption color="#756A6D">{genderLabel(item.gender)}</Caption>
                    </YStack>
                  </XStack>
                </FadeInView>
              );
            }}
          />
        )}
      </YStack>
    </Screen>
  );
}
